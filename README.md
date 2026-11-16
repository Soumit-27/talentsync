# TalentSync

Next.js frontend and Express/Prisma/PostgreSQL API for students and recruiters.

## User journeys

- Student: register as a job seeker, log in, complete the profile, optionally upload a PDF resume, explore jobs/internships, apply, track status, view interviews, and edit the profile.
- Recruiter: register as an employer, log in, create the company, publish/edit/close jobs, review profiles and resumes, update application statuses, schedule/reschedule/cancel interviews, and mark candidates hired or rejected.
- Visitors can browse current openings at /jobs. Workspace pages validate sessions; the API independently enforces roles and ownership.

## Local development

Use Node.js 22 and PostgreSQL 16. Run npm ci in backend and talentsync. Copy backend/.env.example to backend/.env and talentsync/.env.example to talentsync/.env.local, then fill backend credentials.

In backend run npm run db:deploy, then npm run dev. In talentsync run npm run dev. Open http://localhost:3000. The backend uses port 5000. Leave NEXT_PUBLIC_API_URL empty to use the Next.js /api proxy. Existing .env.development settings may override this; remove the API override there if you want the same-origin proxy locally.

Authentication uses HTTP-only cookies. Existing localStorage tokens are intentionally no longer accepted; log in again after upgrading. This application update does not change the database schema.

## Verification

- Backend: npm test (TypeScript compile and 18 API scenarios against actual PostgreSQL).
- Frontend: npm run lint and npm run build.
- Browser: npm run test:e2e in talentsync. Both projects must be installed first. Windows uses installed Edge. Other systems use Chromium: npx playwright install --with-deps chromium. Set PLAYWRIGHT_CHANNEL to override the browser.

Tests read TEST_DATABASE_URL, falling back to backend/.env DATABASE_URL, and require CREATE SCHEMA permission. They create uniquely named test schemas, apply migrations there, and drop only those schemas afterward. Existing application tables are not used. Browser tests own temporary servers on ports 3100 and 5100; keep those ports free. Screenshots and traces are ignored under talentsync/test-artifacts and talentsync/test-results.

## Production

See PRODUCTION.md for HTTPS Docker deployment and service requirements.
