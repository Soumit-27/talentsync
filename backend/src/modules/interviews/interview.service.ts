import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { HttpError } from "../../lib/errors";
const include = {
  application: {
    include: {
      job: true,
      candidate: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  },
} as const;
function future(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date <= new Date())
    throw new HttpError(400, "Choose a future interview date and time.");
  return date;
}
export const createInterview = async (
  recruiterId: string,
  applicationId: string,
  scheduledAt: string,
  meetingLink?: string,
  notes?: string,
) => {
  const date = future(scheduledAt);
  return prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.findFirst({
      where: { id: applicationId, job: { recruiterId } },
    });
    if (!application) throw new HttpError(404, "Application not found.");
    if (["HIRED", "REJECTED"].includes(application.status))
      throw new HttpError(
        409,
        "Reopen this application before scheduling an interview.",
      );
    const existing = await tx.interview.findUnique({
      where: { applicationId },
    });
    if (existing)
      throw new HttpError(
        409,
        "An interview already exists. Use reschedule to update it.",
      );
    const interview = await tx.interview.create({
      data: { applicationId, scheduledAt: date, meetingLink, notes },
      include,
    });
    await tx.jobApplication.update({
      where: { id: applicationId },
      data: { status: "INTERVIEW" },
    });
    return interview;
  });
};
export const getMyInterviews = async (userId: string) => {
  const rows = await prisma.interview.findMany({
    where: { application: { candidate: { userId } } },
    include: { application: { include: { job: true } } },
    orderBy: { scheduledAt: "asc" },
  });
  return rows.map(({ notes: _notes, ...row }) => row);
};
export const getRecruiterInterviews = (recruiterId: string) =>
  prisma.interview.findMany({
    where: { application: { job: { recruiterId } } },
    include,
    orderBy: { scheduledAt: "asc" },
  });
async function owned(
  tx: Prisma.TransactionClient,
  recruiterId: string,
  id: string,
) {
  const interview = await tx.interview.findFirst({
    where: { id, application: { job: { recruiterId } } },
    include,
  });
  if (!interview) throw new HttpError(404, "Interview not found.");
  return interview;
}
export const getInterviewById = (recruiterId: string, interviewId: string) =>
  owned(prisma, recruiterId, interviewId);
export const updateInterview = (
  recruiterId: string,
  interviewId: string,
  data: {
    scheduledAt?: string;
    meetingLink?: string;
    notes?: string;
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  },
) =>
  prisma.$transaction(async (tx) => {
    const existing = await owned(tx, recruiterId, interviewId);
    const scheduledAt = data.scheduledAt
      ? future(data.scheduledAt)
      : existing.scheduledAt;
    const status = data.status ?? existing.status;
    if (
      status === "SCHEDULED" &&
      ["HIRED", "REJECTED"].includes(existing.application.status)
    )
      throw new HttpError(
        409,
        "Reopen this application before scheduling an interview.",
      );
    if (status === "SCHEDULED" && scheduledAt <= new Date())
      throw new HttpError(400, "Reschedule this interview to a future date.");
    const result = await tx.interview.update({
      where: { id: interviewId },
      data: { ...data, scheduledAt },
      include,
    });
    if (status === "CANCELLED" && existing.application.status === "INTERVIEW")
      await tx.jobApplication.update({
        where: { id: existing.applicationId },
        data: { status: "SHORTLISTED" },
      });
    if (status === "SCHEDULED")
      await tx.jobApplication.update({
        where: { id: existing.applicationId },
        data: { status: "INTERVIEW" },
      });
    return result;
  });
export const deleteInterview = (recruiterId: string, interviewId: string) =>
  prisma.$transaction(async (tx) => {
    const existing = await owned(tx, recruiterId, interviewId);
    if (existing.application.status === "INTERVIEW")
      await tx.jobApplication.update({
        where: { id: existing.applicationId },
        data: { status: "SHORTLISTED" },
      });
    return tx.interview.delete({ where: { id: interviewId } });
  });
