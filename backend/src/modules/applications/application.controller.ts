import { sendResumePdf } from "../../utils/resumePdf";
import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma";
import { HttpError } from "../../lib/errors";
import {
  createApplication,
  getMyApplications,
  getRecruiterApplications,
} from "./application.service";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "./application.validation";
export const applyForJob = async (req: Request, res: Response) => {
  const { jobId } = createApplicationSchema.parse(req.body);
  const profile = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { profileCompleted: true },
  });
  if (!profile?.profileCompleted)
    throw new HttpError(409, "Complete your profile before applying.");
  try {
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: await createApplication(req.user.id, jobId),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "Candidate profile not found",
        "Job not found",
        "This job is no longer accepting applications",
        "You have already applied for this job",
      ].includes(error.message)
    )
      throw new HttpError(409, error.message);
    throw error;
  }
};
export const getMyApplicationList = async (req: Request, res: Response) => {
  res.json({ success: true, data: await getMyApplications(req.user.id) });
};
export const getRecruiterApplicationList = async (
  req: Request,
  res: Response,
) => {
  res.json({
    success: true,
    data: await getRecruiterApplications(req.user.id),
  });
};
export const getApplication = async (req: Request, res: Response) => {
  const id = z.string().uuid().parse(req.params.id);
  const data = await prisma.jobApplication.findFirst({
    where: { id, job: { recruiterId: req.user.id } },
    include: {
      job: true,
      interview: true,
      candidate: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });
  if (!data) throw new HttpError(404, "Application not found.");
  res.json({ success: true, data });
};
export const updateApplicationStatus = async (req: Request, res: Response) => {
  const id = z.string().uuid().parse(req.params.id);
  const { status } = updateApplicationStatusSchema.parse(req.body);
  const data = await prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.findFirst({
      where: { id, job: { recruiterId: req.user.id } },
      include: { interview: true },
    });
    if (!application) throw new HttpError(404, "Application not found.");
    if (
      status === "INTERVIEW" &&
      (!application.interview || application.interview.status === "CANCELLED")
    )
      throw new HttpError(
        409,
        "Schedule an interview to move the candidate to this stage.",
      );
    if (status !== "INTERVIEW" && application.interview?.status === "SCHEDULED")
      await tx.interview.update({
        where: { id: application.interview.id },
        data: { status: status === "HIRED" ? "COMPLETED" : "CANCELLED" },
      });
    return tx.jobApplication.update({ where: { id }, data: { status } });
  });
  res.json({ success: true, message: "Application status updated", data });
};

export const viewApplicationResume = async (req: Request, res: Response) => {
  const id = z.string().uuid().parse(req.params.id);
  const application = await prisma.jobApplication.findFirst({
    where: { id, job: { recruiterId: req.user.id } },
    select: { candidate: { select: { resumeUrl: true } } },
  });
  if (!application) throw new HttpError(404, "Application not found.");
  await sendResumePdf(res, application.candidate.resumeUrl);
};
