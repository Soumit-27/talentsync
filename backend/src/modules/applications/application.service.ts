import prisma from "../../lib/prisma";
import { HttpError } from "../../lib/errors";

export const createApplication = (userId: string, jobId: string) =>
  prisma.$transaction(async (tx) => {
    const candidate = await tx.candidateProfile.findUnique({
      where: { userId },
    });
    if (!candidate)
      throw new HttpError(
        409,
        "Complete your candidate profile before applying.",
      );
    const job = await tx.job.findUnique({ where: { id: jobId } });
    if (!job) throw new HttpError(404, "Job not found.");
    if (job.status !== "OPEN")
      throw new HttpError(409, "This job is no longer accepting applications.");
    const existing = await tx.jobApplication.findUnique({
      where: { candidateId_jobId: { candidateId: candidate.id, jobId } },
    });
    if (existing)
      throw new HttpError(409, "You have already applied for this job.");
    return tx.jobApplication.create({
      data: { candidateId: candidate.id, jobId, status: "APPLIED" },
      include: { job: true, candidate: true },
    });
  });

export const getMyApplications = (userId: string) =>
  prisma.jobApplication.findMany({
    where: { candidate: { userId } },
    include: {
      job: true,
      interview: {
        select: {
          id: true,
          scheduledAt: true,
          meetingLink: true,
          status: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

export const getRecruiterApplications = (recruiterId: string) =>
  prisma.jobApplication.findMany({
    where: { job: { recruiterId } },
    include: {
      job: true,
      interview: true,
      candidate: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
