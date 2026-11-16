import { z } from "zod";
const meetingLink = z
  .union([
    z
      .string()
      .trim()
      .url()
      .refine(
        (value) => /^https?:\/\//i.test(value),
        "Use an http or https meeting URL.",
      ),
    z.literal(""),
  ])
  .optional();
export const createInterviewSchema = z.object({
  applicationId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  meetingLink,
  notes: z.string().trim().max(5000).optional(),
});
export const updateInterviewSchema = createInterviewSchema
  .omit({ applicationId: true })
  .partial()
  .extend({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field.",
  );
