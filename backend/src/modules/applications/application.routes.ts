import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  applyForJob,
  getMyApplicationList,
  getRecruiterApplicationList,
  getApplication,
  updateApplicationStatus,
  viewApplicationResume,
} from "./application.controller";
const router = Router();
router.use(authenticate);
router.post("/", authorize("CANDIDATE"), applyForJob);
router.get("/my", authorize("CANDIDATE"), getMyApplicationList);
router.get("/recruiter", authorize("RECRUITER"), getRecruiterApplicationList);
router.get("/:id/resume", authorize("RECRUITER"), viewApplicationResume);
router.get("/:id", authorize("RECRUITER"), getApplication);
router.patch("/:id/status", authorize("RECRUITER"), updateApplicationStatus);
export default router;
