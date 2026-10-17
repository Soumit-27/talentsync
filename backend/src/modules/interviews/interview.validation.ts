import { z } from "zod";

export const createInterviewSchema = z.object({
  applicationId: z.string().uuid("Invalid application ID"),

  scheduledAt: z.string().datetime({
    message: "Invalid date and time",
  }),

  meetingLink: z.string().url().optional(),

  notes: z.string().optional(),
});

export const updateInterviewSchema = z
  .object({
    scheduledAt: z
      .string()
      .datetime({
        message: "Invalid date and time",
      })
      .optional(),

    meetingLink: z
      .string()
      .url()
      .optional(),

    notes: z.string().optional(),

    status: z
      .enum([
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
      ])
      .optional(),
  })
  .refine(
    (data) =>
      data.scheduledAt !== undefined ||
      data.meetingLink !== undefined ||
      data.notes !== undefined ||
      data.status !== undefined,
    {
      message: "At least one field is required",
    }
  );