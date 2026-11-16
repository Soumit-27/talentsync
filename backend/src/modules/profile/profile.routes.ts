import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadResume,
  viewResume,
} from "./profile.controller";
const router = Router();
router.use(authenticate, authorize("CANDIDATE"));
router.post("/", createProfile);
router.get("/", getProfile);
router.get("/resume", viewResume);
router.put("/", updateProfile);
router.delete("/", deleteProfile);
router.post("/upload-resume", upload.single("resume"), uploadResume);
export default router;
