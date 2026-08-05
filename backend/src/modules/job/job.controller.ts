import { Request, Response } from "express";
import { createJobSchema } from "./job.validation";

import {
  createJobService,
  getAllJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "./job.service";

export const createJob = async (req: Request, res: Response) => {
  try {
    const validatedData = createJobSchema.parse(req.body);

    const recruiterId = (req as any).user.id;

    const job = await createJobService(validatedData, recruiterId);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllJobs = async (
  req: Request,
  res: Response
) => {
  try {
    const jobs = await getAllJobsService();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const job = await getJobByIdService(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJob = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const job = await updateJobService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteJob = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await deleteJobService(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};