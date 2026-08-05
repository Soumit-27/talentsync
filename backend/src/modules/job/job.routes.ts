import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "./job.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Recruiter
router.post("/", authenticate, createJob);

// Public
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Recruiter
router.put("/:id", authenticate, updateJob);
router.delete("/:id", authenticate, deleteJob);

export default router;