import { Router } from "express";
import {
  applyForJob,
  getMyApplicationList,
  getRecruiterApplicationList,
} from "./application.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, applyForJob);

// Candidate gets their own applications
router.get("/my", authenticate, getMyApplicationList);

// Recruiter gets applications for their jobs
router.get("/recruiter", authenticate, getRecruiterApplicationList);

export default router;
