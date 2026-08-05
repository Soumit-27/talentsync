import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadResume,
} from "./profile.controller";

import { authenticate } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";



const router = express.Router();

router.post("/", authenticate, createProfile);

router.get("/", authenticate, getProfile);

router.put("/", authenticate, updateProfile);

router.delete("/", authenticate, deleteProfile);

router.post(
  "/upload-resume",
  authenticate,
  upload.single("resume"),
  uploadResume
);

export default router;