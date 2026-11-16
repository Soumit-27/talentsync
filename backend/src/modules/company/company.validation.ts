import { z } from "zod";
export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(150),
  description: z.string().trim().max(5000).optional(),
  website: z
    .union([
      z
        .string()
        .trim()
        .url()
        .refine(
          (value) => /^https?:\/\//i.test(value),
          "Use an http or https website URL.",
        ),
      z.literal(""),
    ])
    .optional(),
  location: z.string().trim().min(2, "Enter your company location.").max(200),
});
