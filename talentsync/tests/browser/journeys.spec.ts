import { test, expect, type Page } from "@playwright/test";
const password = "Browser-test-password-123";
async function register(
  page: Page,
  name: string,
  email: string,
  recruiter = false,
) {
  await page.goto("/auth/register" + (recruiter ? "?role=RECRUITER" : ""));
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.getByRole("status")).toContainText("Account created");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
}
test("recruiter publishes, student applies, recruiter schedules and hires", async ({
  browser,
}) => {
  const recruiterContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const studentContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const recruiter = await recruiterContext.newPage();
  const student = await studentContext.newPage();
  const errors: string[] = [];
  recruiter.on("pageerror", (error) => errors.push(error.message));
  student.on("pageerror", (error) => errors.push(error.message));
  await register(
    recruiter,
    "Browser Recruiter",
    "browser-recruiter@example.com",
    true,
  );
  await expect(recruiter).toHaveURL(/recruiter\/company/);
  await recruiter.getByLabel("Company name").fill("Browser Company");
  await recruiter.getByLabel("Location", { exact: false }).fill("Bengaluru");
  await recruiter
    .getByRole("button", { name: "Create company and continue" })
    .click();
  await expect(recruiter).toHaveURL(/\/dashboard$/);
  await recruiter.getByRole("link", { name: "Job posts", exact: true }).click();
  await recruiter
    .getByRole("button", { name: "Create job", exact: true })
    .click();
  await recruiter.getByLabel("Job title").fill("Browser Frontend Internship");
  await recruiter.getByLabel("Skills").fill("React, TypeScript");
  await recruiter
    .getByLabel("Job description")
    .fill(
      "Build accessible and responsive student-facing interfaces with React and TypeScript alongside our engineering team.",
    );
  await recruiter
    .getByRole("button", { name: "Publish job", exact: true })
    .click();
  await expect(
    recruiter.getByRole("heading", { name: "Browser Frontend Internship" }),
  ).toBeVisible();
  await register(student, "Browser Student", "browser-student@example.com");
  await expect(student).toHaveURL(/candidate\/profile/);
  await student
    .getByLabel("Headline / field of study")
    .fill("Computer science student");
  await student.getByLabel("Phone number").fill("9876543210");
  await student.getByLabel("Current city").fill("Pune");
  await student.getByRole("button", { name: "Save and explore jobs" }).click();
  await expect(student).toHaveURL(/candidateDashboard/);
  await expect(
    student.getByRole("heading", { name: "Browser Frontend Internship" }),
  ).toBeVisible();
  await student
    .getByRole("button", { name: "Apply for this role", exact: true })
    .click();
  await student
    .getByRole("button", { name: "Confirm application", exact: true })
    .click();
  await expect(
    student.getByText("Application submitted.", { exact: false }),
  ).toBeVisible();
  await student
    .getByRole("link", { name: "My applications", exact: true })
    .click();
  await expect(student.getByText("applied", { exact: true })).toBeVisible();
  await recruiter
    .getByRole("link", { name: "Candidates", exact: true })
    .click();
  await recruiter.getByRole("link", { name: "View full profile" }).click();
  await expect(
    recruiter.getByRole("heading", { name: "Browser Student", exact: true }),
  ).toBeVisible();
  await recruiter.getByLabel("Application status").selectOption("SHORTLISTED");
  await recruiter.getByRole("button", { name: "Update status" }).click();
  await expect(
    recruiter.getByText("shortlisted", { exact: true }),
  ).toBeVisible();
  await recruiter
    .getByRole("button", { name: "Schedule interview", exact: true })
    .click();
  const date = new Date(Date.now() + 86400000);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  await recruiter.getByLabel("Date and time").fill(local);
  await recruiter
    .getByLabel("Meeting URL")
    .fill("https://meet.example.com/browser");
  await recruiter
    .getByLabel("Internal recruiter notes")
    .fill("Internal discussion only");
  await recruiter
    .getByRole("button", { name: "Confirm interview", exact: true })
    .click();
  await expect(recruiter.getByText("interview", { exact: true })).toBeVisible();
  await student.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(student.getByText("interview", { exact: true })).toBeVisible();
  await expect(
    student.getByRole("link", { name: "Join meeting", exact: true }),
  ).toHaveAttribute("href", "https://meet.example.com/browser");
  await expect(student.getByText("Internal discussion only")).toHaveCount(0);
  await recruiter.getByLabel("Application status").selectOption("HIRED");
  await recruiter.getByRole("button", { name: "Update status" }).click();
  await expect(recruiter.getByText("hired", { exact: true })).toBeVisible();
  await student.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(
    student.getByText("Congratulations!", { exact: false }),
  ).toBeVisible();
  await student.screenshot({
    path: "test-artifacts/student-mobile.png",
    fullPage: true,
  });
  await recruiter.screenshot({
    path: "test-artifacts/recruiter-desktop.png",
    fullPage: true,
  });
  await student.getByRole("link", { name: "My profile", exact: true }).click();
  await expect(student.getByLabel("Headline / field of study")).toHaveValue(
    "Computer science student",
  );
  await student
    .getByLabel("Headline / field of study")
    .fill("Frontend developer");
  await student
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await expect(student.getByRole("status")).toContainText("Profile saved");
  await student.goto("/dashboard");
  await expect(student).toHaveURL(/candidateDashboard/);
  await student.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(student).toHaveURL(/auth\/login/);
  await student.goto("/candidate/applications");
  await expect(student).toHaveURL(/auth\/login/);
  expect(errors).toEqual([]);
  await recruiterContext.close();
  await studentContext.close();
});
test("public jobs and invalid login work on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/jobs?q=Frontend&location=Bengaluru");
  await expect(
    page.getByRole("textbox", { name: "Search jobs", exact: true }),
  ).toHaveValue("Frontend");
  await expect(
    page.getByRole("textbox", { name: "Job location", exact: true }),
  ).toHaveValue("Bengaluru");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your next chapter",
  );
  await page.getByRole("link", { name: "Log in", exact: true }).click();
  await page.getByLabel("Email address").fill("missing@example.com");
  await page.getByLabel("Password", { exact: true }).fill("incorrect");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "Email or password is incorrect",
  );
});
