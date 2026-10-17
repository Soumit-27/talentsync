import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "APPLIED",
    "SCREENING",
    "SHORTLISTED",
    "INTERVIEW",
    "REJECTED",
    "HIRED",
  ]),
});