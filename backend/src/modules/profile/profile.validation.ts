import { z } from "zod";
const link = z
  .union([
    z
      .string()
      .trim()
      .url()
      .refine(
        (value) => /^https?:\/\//i.test(value),
        "Use an http or https URL.",
      ),
    z.literal(""),
  ])
  .optional();
export const profileSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number."),
  title: z
    .string()
    .trim()
    .min(2, "Enter your headline or field of study.")
    .max(150),
  about: z.string().trim().max(5000).optional(),
  experience: z.number().int().min(0).max(50).optional(),
  currentCompany: z.string().trim().max(150).optional(),
  currentSalary: z.number().finite().nonnegative().optional(),
  expectedSalary: z.number().finite().nonnegative().optional(),
  noticePeriod: z.string().trim().max(100).optional(),
  location: z.string().trim().min(2, "Enter your location.").max(200),
  preferredLocation: z.string().trim().max(200).optional(),
  github: link,
  linkedin: link,
  portfolio: link,
});
export type ProfileInput = z.infer<typeof profileSchema>;
