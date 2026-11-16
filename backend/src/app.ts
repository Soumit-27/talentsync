import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import profileRoutes from "./modules/profile/profile.routes";
import jobRoutes from "./modules/job/job.routes";
import applicationRoutes from "./modules/applications/application.routes";
import interviewRoutes from "./modules/interviews/interview.routes";
import companyRoutes from "./modules/company/company.routes";
import { errorHandler } from "./lib/errors";
export const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
const origins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((value) => value.trim());
app.use(cors({ origin: origins, credentials: true }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (req.path.startsWith("/api")) res.setHeader("Cache-Control", "no-store");
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.headers.origin &&
    !origins.includes(req.headers.origin)
  ) {
    res
      .status(403)
      .json({ success: false, message: "This request origin is not allowed." });
    return;
  }
  next();
});
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.get("/", (_req, res) => {
  res.json({ success: true, service: "TalentSync API" });
});
app.get("/health", (_req, res) => {
  res.json({ success: true });
});
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/companies", companyRoutes);
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found." });
});
app.use(errorHandler);
