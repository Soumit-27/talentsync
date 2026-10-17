import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters"),

  description: z
    .string()
    .optional(),

  website: z
    .string()
    .url("Invalid website URL")
    .optional(),

  location: z
    .string()
    .optional(),
});