import { z } from "zod";
export const createJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Enter a job title with at least 3 characters.")
    .max(150),
  description: z
    .string()
    .trim()
    .min(30, "Describe the role in at least 30 characters.")
    .max(20000),
  companyName: z.string().trim().max(150).optional(),
  location: z.string().trim().min(2, "Enter a location or Remote.").max(200),
  salary: z.number().finite().nonnegative().max(100000000).optional(),
  experience: z.number().int().min(0).max(50).optional(),
  skills: z
    .array(z.string().trim().min(1).max(60))
    .min(1, "Add at least one skill.")
    .max(30),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
});
export const updateJobSchema = createJobSchema
  .partial()
  .extend({ status: z.enum(["OPEN", "CLOSED"]).optional() })
  .refine(
    (value) => Object.keys(value).length > 0,
    "Provide at least one field.",
  );
export type CreateJobInput = z.infer<typeof createJobSchema>;
