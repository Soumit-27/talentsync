const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync, execFileSync } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const root = path.resolve(__dirname, "../..");
const backend = path.join(root, "backend");
require(path.join(backend, "node_modules/dotenv")).config({
  path: path.join(backend, ".env"),
  quiet: true,
});
const { PrismaClient } = require(
  path.join(backend, "node_modules/@prisma/client"),
);
const schema = "talentsync_browser_" + randomUUID().replaceAll("-", "");
let admin,
  prisma,
  server,
  next,
  created = false;
async function run() {
  try {
    const source = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
    if (!source)
      throw new Error(
        "Set TEST_DATABASE_URL or DATABASE_URL for isolated browser tests.",
      );
    if (!/^talentsync_browser_[a-f0-9]+$/.test(schema))
      throw new Error("Invalid test schema.");
    admin = new PrismaClient({ datasourceUrl: source });
    await admin.$executeRawUnsafe('CREATE SCHEMA "' + schema + '"');
    created = true;
    const url = new URL(source);
    url.searchParams.set("schema", schema);
    process.env.DATABASE_URL = url.toString();
    process.env.JWT_SECRET = randomUUID() + randomUUID();
    process.env.FRONTEND_URL = "http://localhost:3100";
    process.env.NODE_ENV = "test";
    execFileSync(
      process.execPath,
      [require.resolve(path.join(backend, "node_modules/typescript/bin/tsc"))],
      { cwd: backend, stdio: "inherit" },
    );
    try {
      execFileSync(
        process.execPath,
        [
          require.resolve(
            path.join(backend, "node_modules/prisma/build/index.js"),
          ),
          "migrate",
          "deploy",
        ],
        { cwd: backend, env: process.env, stdio: "pipe", timeout: 60000 },
      );
    } catch {
      throw new Error("Could not migrate the isolated browser test schema.");
    }
    prisma = require(path.join(backend, "dist/lib/prisma")).default;
    const rows = await prisma.$queryRawUnsafe(
      "SELECT current_schema() AS name",
    );
    if (rows[0].name !== schema) throw new Error("Test schema mismatch.");
    const { app } = require(path.join(backend, "dist/app"));
    await new Promise((resolve, reject) => {
      server = app.listen(5100, resolve);
      server.once("error", reject);
    });
    fs.mkdirSync(path.join(root, "talentsync/test-artifacts"), {
      recursive: true,
    });
    const log = fs.openSync(
      path.join(root, "talentsync/test-artifacts/next.log"),
      "w",
    );
    next = spawn(
      process.execPath,
      [require.resolve("next/dist/bin/next"), "dev", "--port", "3100"],
      {
        cwd: path.join(root, "talentsync"),
        windowsHide: true,
        env: {
          ...process.env,
          NODE_ENV: "development",
          NEXT_PUBLIC_API_URL: "",
          API_URL: "http://localhost:5100",
          NEXT_DIST_DIR: ".next-e2e",
        },
        stdio: ["ignore", log, log],
      },
    );
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (next.exitCode !== null)
        throw new Error(
          "The browser test frontend failed to start. See test-artifacts/next.log.",
        );
      try {
        const response = await fetch("http://localhost:3100/auth/login");
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready)
      throw new Error("The browser test frontend did not become ready.");
    console.log(
      "Browser tests use isolated PostgreSQL data and temporary ports 3100/5100.",
    );
    process.exitCode = await new Promise((resolve, reject) => {
      const browserTests = spawn(
        process.execPath,
        [require.resolve("@playwright/test/cli"), "test"],
        {
          cwd: path.join(root, "talentsync"),
          env: process.env,
          stdio: "inherit",
          windowsHide: true,
        },
      );
      browserTests.once("error", reject);
      browserTests.once("exit", (code) => resolve(code ?? 1));
    });
  } catch (error) {
    console.error(
      error.message?.includes("postgresql://")
        ? "Browser test setup failed. Check database configuration."
        : error.message,
    );
    process.exitCode = 1;
  } finally {
    if (next?.pid && next.exitCode === null) {
      if (process.platform === "win32")
        spawnSync("taskkill", ["/PID", String(next.pid), "/T", "/F"], {
          windowsHide: true,
          stdio: "ignore",
        });
      else next.kill("SIGTERM");
    }
    if (server?.listening)
      await new Promise((resolve) => server.close(resolve));
    if (prisma) await prisma.$disconnect();
    if (created && /^talentsync_browser_[a-f0-9]+$/.test(schema))
      await admin.$executeRawUnsafe('DROP SCHEMA "' + schema + '" CASCADE');
    if (admin) await admin.$disconnect();
  }
}
run();
