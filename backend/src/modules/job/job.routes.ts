import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "./job.controller";
const router = Router();
router.get("/", getAllJobs);
router.get("/my", authenticate, authorize("RECRUITER"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", authenticate, authorize("RECRUITER"), createJob);
router.put("/:id", authenticate, authorize("RECRUITER"), updateJob);
router.delete("/:id", authenticate, authorize("RECRUITER"), deleteJob);
export default router;
