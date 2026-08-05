import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3, "Title is required"),

  description: z.string().min(10, "Description is required"),

  companyName: z.string().min(2, "Company name is required"),

  location: z.string().min(2, "Location is required"),

  salary: z.number().optional(),

  experience: z.number().optional(),

  skills: z.array(z.string()).min(1, "At least one skill is required"),

  jobType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
  ]),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;