# Production deployment

The application flows are implemented. A public deployment still needs a domain, server, database credentials, email credentials, and Cloudinary credentials. These are environment configuration; no application code edits are required.

## HTTPS Docker deployment

1. Point your domain DNS at a Linux server with Docker Compose. Allow inbound ports 80 and 443.
2. Copy production.env.example to .env in the repository root. Set DOMAIN to your hostname without https://. Replace the database password and JWT secret with strong random values. Set email and Cloudinary credentials. Use a URL-safe database password, or percent-encode reserved characters if constructing your own DATABASE_URL.
3. Back up an existing database before applying migrations. The production Compose file creates its own production_data volume and does not reuse the development volume.
4. Run: docker compose -f compose.production.yaml up -d --build
5. Open https://your-domain. Caddy obtains HTTPS certificates, the API sets secure HTTP-only cookies, and /api requests travel through Next.js to the private backend. PostgreSQL and the API have no public port bindings in this setup.

Inspect startup with docker compose -f compose.production.yaml logs. The backend applies existing Prisma migrations before serving. Do not edit applied migration files. A historical migration rebuilds the role column; review pending history before migrating an older database with existing users.

## Service configuration

- PostgreSQL: persistent storage, scheduled backups, and a tested restore process.
- JWT_SECRET: at least 32 random characters; keep private. Changing it signs everyone out.
- EMAIL_USER and EMAIL_PASS: Gmail account and app password for password recovery. Verify delivery to a real mailbox after deployment. The API returns the same response for unknown emails and delivery failures to avoid revealing account existence; delivery failures are logged without credentials.
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET: enable raw/PDF uploads and PDF delivery in Cloudinary. Verify an actual upload and download after deployment. Resumes are PDF-only, up to 5 MB. Workspace PDF previews use authenticated API endpoints with student/recruiter ownership checks. Original Cloudinary URLs remain accessible to anyone holding the link.

## Other hosting providers

Deploy backend and frontend as separate Node.js services. Backend needs DATABASE_URL, JWT_SECRET, FRONTEND_URL (the exact public HTTPS frontend origin), NODE_ENV=production, and upload/email credentials. Run npm start; it applies pending Prisma migrations before starting the API and stops if migration fails. On Render, set the root directory to backend, the build command to npm ci --include=dev && npm run build, and the start command to npm start. Ensure DATABASE_URL points to the intended production database. Set TRUST_PROXY=1 only when one trusted proxy sits directly before Express; otherwise configure your platform ingress appropriately.

Set frontend API_URL to the backend origin before npm run build and leave NEXT_PUBLIC_API_URL empty. Rewrites are compiled during build, so rebuild when API_URL changes. Use the frontend domain for browser API requests. Direct cross-site API deployments may encounter third-party cookie restrictions; use the same-origin proxy to avoid that dependency.

## Live verification

Before opening access, create a student and recruiter account on the deployed HTTPS domain, publish a test role, apply, schedule an interview, and verify the student tracker. Verify real password recovery email, a real resume upload/download, sign-out, and page refreshes. Automated tests cover APIs and desktop/mobile journeys, but deliberately do not send real mail or upload documents to the live Cloudinary account.

The authentication limiter is per process; add shared ingress rate limiting before scaling to multiple API instances. Public job browsing currently loads open jobs in one response; add server-side pagination before growing to a large catalogue. This app has student and recruiter workspaces, with no admin workspace, employer verification service, payments, or automated candidate matching.
