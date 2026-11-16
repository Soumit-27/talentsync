const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID, createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");
// All writes occur in a new, isolated PostgreSQL schema. Application data is untouched.
const sourceUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
const schema = "talentsync_test_" + randomUUID().replaceAll("-", "");
let admin,
  prisma,
  server,
  base,
  schemaCreated = false;
before(
  async () => {
    assert.ok(
      sourceUrl,
      "Set TEST_DATABASE_URL (or DATABASE_URL) to a PostgreSQL database that allows temporary schemas.",
    );
    assert.match(schema, /^talentsync_test_[a-f0-9]+$/);
    admin = new PrismaClient({ datasourceUrl: sourceUrl });
    await admin.$executeRawUnsafe('CREATE SCHEMA "' + schema + '"');
    schemaCreated = true;
    const url = new URL(sourceUrl);
    url.searchParams.set("schema", schema);
    process.env.DATABASE_URL = url.toString();
    process.env.JWT_SECRET = randomUUID() + randomUUID();
    process.env.NODE_ENV = "test";
    process.env.FRONTEND_URL = "http://localhost:3000";
    try {
      execFileSync(
        process.execPath,
        [require.resolve("prisma/build/index.js"), "migrate", "deploy"],
        {
          cwd: path.resolve(__dirname, ".."),
          env: process.env,
          stdio: "pipe",
          timeout: 60000,
        },
      );
    } catch {
      throw new Error(
        "Could not migrate the isolated test schema. Check PostgreSQL permissions and migration files.",
      );
    }
    prisma = require("../dist/lib/prisma").default;
    const rows = await prisma.$queryRawUnsafe(
      "SELECT current_schema() AS name",
    );
    assert.equal(rows[0].name, schema);
    const { app } = require("../dist/app");
    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });
    base = "http://127.0.0.1:" + server.address().port;
  },
  { timeout: 90000 },
);
after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (prisma) await prisma.$disconnect();
  if (schemaCreated && /^talentsync_test_[a-f0-9]+$/.test(schema))
    await admin.$executeRawUnsafe('DROP SCHEMA "' + schema + '" CASCADE');
  if (admin) await admin.$disconnect();
});
async function request(url, { method = "GET", cookie, body, origin } = {}) {
  const headers = {};
  if (cookie) headers.cookie = cookie;
  if (origin) headers.origin = origin;
  if (body !== undefined) headers["content-type"] = "application/json";
  const response = await fetch(base + url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    status: response.status,
    data: await response.json(),
    cookie: response.headers.get("set-cookie"),
    headers: response.headers,
  };
}
const password = "TalentSync-test-123";
let recruiter, student, stranger, job, application, interview, resetToken;
test("student and recruiter journeys against isolated PostgreSQL", async (t) => {
  await t.test(
    "registers both roles and normalizes email addresses",
    async () => {
      for (const [email, role] of [
        ["Recruiter@Example.com", "RECRUITER"],
        ["Student@Example.com", "CANDIDATE"],
        ["Other@Example.com", "RECRUITER"],
      ]) {
        const result = await request("/api/auth/register", {
          method: "POST",
          body: {
            name: role === "CANDIDATE" ? "Test Student" : "Test Recruiter",
            email,
            password,
            role,
          },
        });
        assert.equal(result.status, 201);
        assert.equal(result.data.user.email, email.toLowerCase());
        assert.equal(result.data.user.password, undefined);
      }
      assert.equal(
        (
          await request("/api/auth/register", {
            method: "POST",
            body: {
              name: "Duplicate",
              email: "student@example.com",
              password,
              role: "CANDIDATE",
            },
          })
        ).status,
        409,
      );
    },
  );
  await t.test(
    "rejects weak passwords and self-assigned admin roles",
    async () => {
      assert.equal(
        (
          await request("/api/auth/register", {
            method: "POST",
            body: {
              name: "Bad",
              email: "bad@example.com",
              password: "short",
              role: "CANDIDATE",
            },
          })
        ).status,
        400,
      );
      assert.equal(
        (
          await request("/api/auth/register", {
            method: "POST",
            body: {
              name: "Bad",
              email: "bad@example.com",
              password,
              role: "ADMIN",
            },
          })
        ).status,
        400,
      );
    },
  );
  await t.test(
    "creates HTTP-only cookie sessions and rejects bad credentials",
    async () => {
      const cookies = [];
      for (const email of [
        "recruiter@example.com",
        "student@example.com",
        "other@example.com",
      ]) {
        const result = await request("/api/auth/login", {
          method: "POST",
          body: { email, password },
        });
        assert.equal(result.status, 200);
        assert.match(result.cookie, /HttpOnly/i);
        assert.match(result.cookie, /SameSite=Lax/i);
        assert.equal(result.data.token, undefined);
        cookies.push(result.cookie.split(";")[0]);
      }
      [recruiter, student, stranger] = cookies;
      assert.equal(
        (
          await request("/api/auth/login", {
            method: "POST",
            body: { email: "student@example.com", password: "incorrect" },
          })
        ).status,
        401,
      );
      assert.equal((await request("/api/auth/me")).status, 401);
      assert.equal(
        (
          await request("/api/auth/me", {
            cookie: "talentsync_session=invalid",
          })
        ).status,
        401,
      );
    },
  );
  await t.test(
    "requires recruiter company onboarding and blocks student access",
    async () => {
      assert.equal(
        (await request("/api/companies/me", { cookie: recruiter })).data.data,
        null,
      );
      const payload = {
        title: "Frontend Intern",
        description: "Build accessible interfaces with our engineering team.",
        location: "Remote",
        skills: ["React"],
        jobType: "INTERNSHIP",
        experience: 0,
      };
      assert.equal(
        (
          await request("/api/jobs", {
            method: "POST",
            cookie: recruiter,
            body: payload,
          })
        ).status,
        409,
      );
      assert.equal(
        (
          await request("/api/companies", {
            method: "POST",
            cookie: student,
            body: { name: "Bad", location: "Remote" },
          })
        ).status,
        403,
      );
      const company = await request("/api/companies", {
        method: "POST",
        cookie: recruiter,
        body: {
          name: "Test Company",
          website: "",
          description: "A test team",
          location: "Bengaluru",
        },
      });
      assert.equal(company.status, 201);
      assert.equal(
        (await request("/api/auth/me", { cookie: recruiter })).data.user.company
          .name,
        "Test Company",
      );
    },
  );
  await t.test(
    "publishes a real job using the recruiter company name",
    async () => {
      const payload = {
        title: "Frontend Intern",
        description: "Build accessible interfaces with our engineering team.",
        companyName: "Spoofed Company",
        location: "Remote",
        skills: ["React", "CSS"],
        jobType: "INTERNSHIP",
        experience: 0,
        salary: 120000,
      };
      const result = await request("/api/jobs", {
        method: "POST",
        cookie: recruiter,
        body: payload,
      });
      assert.equal(result.status, 201);
      job = result.data.data;
      assert.equal(job.companyName, "Test Company");
      assert.equal((await request("/api/jobs")).data.data.length, 1);
      assert.equal(
        (await request("/api/jobs/my", { cookie: stranger })).data.data.length,
        0,
      );
      assert.equal(
        (await request("/api/jobs/my", { cookie: recruiter })).data.data[0]
          ._count.applications,
        0,
      );
    },
  );
  await t.test(
    "enforces job ownership, rejects mass assignment and invalid inputs",
    async () => {
      assert.equal(
        (
          await request("/api/jobs/" + job.id, {
            method: "PUT",
            cookie: stranger,
            body: { title: "Hijack" },
          })
        ).status,
        404,
      );
      assert.equal(
        (
          await request("/api/jobs/" + job.id, {
            method: "DELETE",
            cookie: stranger,
          })
        ).status,
        404,
      );
      assert.equal(
        (
          await request("/api/jobs/" + job.id, {
            method: "PUT",
            cookie: student,
            body: { title: "Hijack" },
          })
        ).status,
        403,
      );
      assert.equal(
        (
          await request("/api/jobs/" + job.id, {
            method: "PUT",
            cookie: recruiter,
            body: { recruiterId: "bad", salary: -1 },
          })
        ).status,
        400,
      );
      assert.equal((await request("/api/jobs/not-a-uuid")).status, 400);
      const result = await request("/api/jobs/" + job.id, {
        method: "PUT",
        cookie: recruiter,
        body: { recruiterId: "bad", title: "Updated Internship" },
      });
      assert.equal(result.status, 200);
      assert.equal(result.data.data.recruiterId, job.recruiterId);
    },
  );
  await t.test("requires a student profile before applying", async () => {
    assert.equal(
      (
        await request("/api/applications", {
          method: "POST",
          cookie: student,
          body: { jobId: job.id },
        })
      ).status,
      409,
    );
    assert.equal(
      (
        await request("/api/profile", {
          method: "POST",
          cookie: recruiter,
          body: {},
        })
      ).status,
      403,
    );
  });
  await t.test(
    "creates and edits a fresher profile without allowing ownership injection",
    async () => {
      const payload = {
        userId: job.recruiterId,
        title: "Computer science student",
        phone: "+91 9876543210",
        location: "Pune",
        experience: 0,
        expectedSalary: 0,
        github: "",
        linkedin: "",
        portfolio: "",
      };
      const first = await request("/api/profile", {
        method: "POST",
        cookie: student,
        body: payload,
      });
      assert.equal(first.status, 201);
      assert.notEqual(first.data.userId, job.recruiterId);
      const second = await request("/api/profile", {
        method: "POST",
        cookie: student,
        body: { ...payload, title: "Frontend developer" },
      });
      assert.equal(second.status, 201);
      assert.equal(second.data.id, first.data.id);
      assert.equal(
        (await request("/api/auth/me", { cookie: student })).data.user
          .profileCompleted,
        true,
      );
      assert.equal(
        (
          await request("/api/profile", {
            method: "POST",
            cookie: student,
            body: { ...payload, github: "javascript:alert(1)" },
          })
        ).status,
        400,
      );
    },
  );
  await t.test(
    "applies once and lists only the appropriate applications",
    async () => {
      const result = await request("/api/applications", {
        method: "POST",
        cookie: student,
        body: { jobId: job.id },
      });
      assert.equal(result.status, 201);
      application = result.data.data;
      assert.equal(
        (
          await request("/api/applications", {
            method: "POST",
            cookie: student,
            body: { jobId: job.id },
          })
        ).status,
        409,
      );
      assert.equal(
        (await request("/api/applications/my", { cookie: student })).data.data
          .length,
        1,
      );
      assert.equal(
        (await request("/api/applications/recruiter", { cookie: recruiter }))
          .data.data.length,
        1,
      );
      assert.equal(
        (await request("/api/applications/recruiter", { cookie: stranger }))
          .data.data.length,
        0,
      );
      assert.equal(
        (await request("/api/applications/recruiter", { cookie: student }))
          .status,
        403,
      );
    },
  );
  await t.test(
    "updates application statuses with recruiter ownership checks",
    async () => {
      const endpoint = "/api/applications/" + application.id + "/status";
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: stranger,
            body: { status: "HIRED" },
          })
        ).status,
        404,
      );
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: student,
            body: { status: "HIRED" },
          })
        ).status,
        403,
      );
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: recruiter,
            body: { status: "SCREENING" },
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: recruiter,
            body: { status: "INTERVIEW" },
          })
        ).status,
        409,
      );
      assert.equal(
        (await request("/api/applications/my", { cookie: student })).data
          .data[0].status,
        "SCREENING",
      );
      assert.equal(
        (
          await request("/api/applications/" + application.id, {
            cookie: stranger,
          })
        ).status,
        404,
      );
    },
  );
  await t.test(
    "schedules interviews, validates time, and keeps recruiter notes private",
    async () => {
      const payload = {
        applicationId: application.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        meetingLink: "",
        notes: "Private recruiter note",
      };
      assert.equal(
        (
          await request("/api/interviews", {
            method: "POST",
            cookie: stranger,
            body: payload,
          })
        ).status,
        404,
      );
      assert.equal(
        (
          await request("/api/interviews", {
            method: "POST",
            cookie: recruiter,
            body: { ...payload, scheduledAt: "2020-01-01T00:00:00.000Z" },
          })
        ).status,
        400,
      );
      const result = await request("/api/interviews", {
        method: "POST",
        cookie: recruiter,
        body: payload,
      });
      assert.equal(result.status, 201);
      interview = result.data.data;
      assert.equal(
        (
          await request("/api/interviews", {
            method: "POST",
            cookie: recruiter,
            body: payload,
          })
        ).status,
        409,
      );
      const mine = await request("/api/interviews/my", { cookie: student });
      assert.equal(mine.data.data.length, 1);
      assert.equal(mine.data.data[0].notes, undefined);
      const app = (await request("/api/applications/my", { cookie: student }))
        .data.data[0];
      assert.equal(app.status, "INTERVIEW");
      assert.equal(app.interview.notes, undefined);
    },
  );
  await t.test(
    "cancels and reschedules interviews while synchronizing the application",
    async () => {
      const endpoint = "/api/interviews/" + interview.id;
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: stranger,
            body: { status: "CANCELLED" },
          })
        ).status,
        404,
      );
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: recruiter,
            body: { status: "CANCELLED" },
          })
        ).status,
        200,
      );
      assert.equal(
        (await request("/api/applications/my", { cookie: student })).data
          .data[0].status,
        "SHORTLISTED",
      );
      assert.equal(
        (
          await request(endpoint, {
            method: "PATCH",
            cookie: recruiter,
            body: {
              scheduledAt: new Date(Date.now() + 172800000).toISOString(),
              status: "SCHEDULED",
              meetingLink: "https://meet.example.com/test",
            },
          })
        ).status,
        200,
      );
      assert.equal(
        (await request("/api/applications/my", { cookie: student })).data
          .data[0].status,
        "INTERVIEW",
      );
      assert.equal(
        (
          await request("/api/applications/" + application.id + "/status", {
            method: "PATCH",
            cookie: recruiter,
            body: { status: "HIRED" },
          })
        ).status,
        200,
      );
      assert.equal(
        (await request("/api/interviews/recruiter", { cookie: recruiter })).data
          .data[0].status,
        "COMPLETED",
      );
    },
  );
  await t.test(
    "closing jobs removes them from public results and prevents new applications",
    async () => {
      assert.equal(
        (
          await request("/api/jobs/" + job.id, {
            method: "PUT",
            cookie: recruiter,
            body: { status: "CLOSED" },
          })
        ).status,
        200,
      );
      assert.equal((await request("/api/jobs")).data.data.length, 0);
      assert.equal(
        (
          await request("/api/applications", {
            method: "POST",
            cookie: student,
            body: { jobId: job.id },
          })
        ).status,
        409,
      );
      assert.equal(
        (await request("/api/applications/my", { cookie: student })).data.data
          .length,
        1,
      );
    },
  );
  await t.test(
    "updating company details keeps the recruiter job branding consistent",
    async () => {
      const result = await request("/api/companies/me", {
        method: "PUT",
        cookie: recruiter,
        body: { name: "Renamed Company", location: "Pune", website: "" },
      });
      assert.equal(result.status, 200);
      assert.equal(
        (await request("/api/jobs/my", { cookie: recruiter })).data.data[0]
          .companyName,
        "Renamed Company",
      );
    },
  );
  await t.test(
    "blocks cross-origin mutations and rejects invalid resume content",
    async () => {
      assert.equal(
        (
          await request("/api/jobs/" + job.id, {
            method: "PUT",
            cookie: recruiter,
            origin: "https://untrusted.example",
            body: { status: "OPEN" },
          })
        ).status,
        403,
      );
      const form = new FormData();
      form.append(
        "resume",
        new Blob(["not a PDF"], { type: "application/pdf" }),
        "resume.pdf",
      );
      const result = await fetch(base + "/api/profile/upload-resume", {
        method: "POST",
        headers: { cookie: student },
        body: form,
      });
      assert.equal(result.status, 400);
    },
  );
  await t.test(
    "previews legacy attachment PDFs inline with resume ownership checks",
    async () => {
      const user = await prisma.user.findUnique({
        where: { email: "student@example.com" },
      });
      const original = await prisma.candidateProfile.findUnique({
        where: { userId: user.id },
      });
      await prisma.candidateProfile.update({
        where: { userId: user.id },
        data: {
          resumeUrl:
            "https://res.cloudinary.com/test/raw/upload/v1/legacy-resume",
        },
      });
      const nativeFetch = global.fetch;
      let upstreamCalls = 0;
      let validPdf = true;
      global.fetch = async (input, options) => {
        const url = new URL(input instanceof Request ? input.url : input);
        if (url.hostname === "res.cloudinary.com") {
          upstreamCalls++;
          return new Response(
            validPdf ? "%PDF-1.4\nlegacy test document" : "not a PDF",
            {
              headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=legacy-resume",
              },
            },
          );
        }
        return nativeFetch(input, options);
      };
      try {
        for (const [endpoint, cookie] of [
          ["/api/profile/resume", student],
          ["/api/applications/" + application.id + "/resume", recruiter],
        ]) {
          const result = await fetch(base + endpoint, { headers: { cookie } });
          assert.equal(result.status, 200);
          assert.equal(result.headers.get("content-type"), "application/pdf");
          assert.match(
            result.headers.get("content-disposition"),
            /^inline; filename="resume.pdf"$/,
          );
          assert.equal(
            result.headers.get("cache-control"),
            "private, no-store",
          );
          assert.match(await result.text(), /^%PDF-/);
        }
        assert.equal((await request("/api/profile/resume")).status, 401);
        assert.equal(
          (await request("/api/profile/resume", { cookie: recruiter })).status,
          403,
        );
        assert.equal(
          (
            await request("/api/applications/" + application.id + "/resume", {
              cookie: stranger,
            })
          ).status,
          404,
        );
        assert.equal(
          (
            await request("/api/applications/" + application.id + "/resume", {
              cookie: student,
            })
          ).status,
          403,
        );
        assert.equal(upstreamCalls, 2);
        validPdf = false;
        assert.equal(
          (await request("/api/profile/resume", { cookie: student })).status,
          502,
        );
        await prisma.candidateProfile.update({
          where: { userId: user.id },
          data: { resumeUrl: "http://127.0.0.1/private" },
        });
        assert.equal(
          (await request("/api/profile/resume", { cookie: student })).status,
          502,
        );
        assert.equal(upstreamCalls, 3);
      } finally {
        global.fetch = nativeFetch;
        await prisma.candidateProfile.update({
          where: { userId: user.id },
          data: { resumeUrl: original.resumeUrl },
        });
      }
    },
  );
  await t.test(
    "password reset is single use and invalidates existing sessions",
    async () => {
      const user = await prisma.user.findUnique({
        where: { email: "student@example.com" },
      });
      resetToken =
        randomUUID().replaceAll("-", "") + randomUUID().replaceAll("-", "");
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: createHash("sha256").update(resetToken).digest("hex"),
          expiresAt: new Date(Date.now() + 60000),
        },
      });
      const body = {
        token: resetToken,
        password: "Replacement-password-123",
        confirmPassword: "Replacement-password-123",
      };
      assert.equal(
        (await request("/api/auth/reset-password", { method: "POST", body }))
          .status,
        200,
      );
      assert.equal(
        (await request("/api/auth/me", { cookie: student })).status,
        401,
      );
      assert.equal(
        (await request("/api/auth/reset-password", { method: "POST", body }))
          .status,
        400,
      );
      assert.equal(
        (
          await request("/api/auth/login", {
            method: "POST",
            body: { email: "student@example.com", password: body.password },
          })
        ).status,
        200,
      );
    },
  );
  await t.test(
    "logout expires the browser session cookie and API errors are safe",
    async () => {
      const result = await request("/api/auth/logout", {
        method: "POST",
        cookie: recruiter,
      });
      assert.equal(result.status, 200);
      assert.match(result.cookie, /Expires=Thu, 01 Jan 1970/i);
      assert.equal((await request("/api/missing")).status, 404);
      assert.equal(
        (await request("/api/auth/me", { cookie: stranger })).headers.get(
          "cache-control",
        ),
        "no-store",
      );
    },
  );
});
