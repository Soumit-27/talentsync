import { z } from "zod";

export const profileSchema = z.object({
  phone: z.string().optional(),
  title: z.string().optional(),
  about: z.string().optional(),
  experience: z.number().optional(),
  currentCompany: z.string().optional(),
  currentSalary: z.number().optional(),
  expectedSalary: z.number().optional(),
  noticePeriod: z.string().optional(),
  location: z.string().optional(),
  preferredLocation: z.string().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  portfolio: z.string().url().optional(),
  resumeUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;