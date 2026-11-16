import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  scheduleInterview,
  getMyInterviewList,
  getRecruiterInterviewList,
  getSingleInterview,
  editInterview,
  removeInterview,
} from "./interview.controller";
const router = Router();
router.use(authenticate);
router.get("/my", authorize("CANDIDATE"), getMyInterviewList);
router.use(authorize("RECRUITER"));
router.post("/", scheduleInterview);
router.get("/recruiter", getRecruiterInterviewList);
router.get("/:id", getSingleInterview);
router.patch("/:id", editInterview);
router.delete("/:id", removeInterview);
export default router;
