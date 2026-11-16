import { Request, Response } from "express";
import { z } from "zod";
import { createJobSchema, updateJobSchema } from "./job.validation";
import * as jobs from "./job.service";
import { HttpError } from "../../lib/errors";
const id = (req: Request) =>
  z.string().uuid("Invalid job ID.").parse(req.params.id);
export const createJob = async (req: Request, res: Response) => {
  res
    .status(201)
    .json({
      success: true,
      message: "Job published successfully",
      data: await jobs.createJobService(
        createJobSchema.parse(req.body),
        req.user.id,
      ),
    });
};
export const getAllJobs = async (_req: Request, res: Response) => {
  res.json({ success: true, data: await jobs.getAllJobsService() });
};
export const getMyJobs = async (req: Request, res: Response) => {
  res.json({ success: true, data: await jobs.getMyJobsService(req.user.id) });
};
export const getJobById = async (req: Request, res: Response) => {
  const data = await jobs.getJobByIdService(id(req));
  if (!data) throw new HttpError(404, "Job not found.");
  res.json({ success: true, data });
};
export const updateJob = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Job updated successfully",
    data: await jobs.updateJobService(
      id(req),
      req.user.id,
      updateJobSchema.parse(req.body),
    ),
  });
};
export const deleteJob = async (req: Request, res: Response) => {
  await jobs.deleteJobService(id(req), req.user.id);
  res.json({ success: true, message: "Job deleted successfully" });
};
