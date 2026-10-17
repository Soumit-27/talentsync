import { Request, Response } from "express";
import { createApplication,  getMyApplications, getRecruiterApplications} from "./application.service";
import { createApplicationSchema } from "./application.validation";

export const applyForJob = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = createApplicationSchema.parse(req.body);

    // userId comes from authentication middleware
    const userId = req.user.id;

    const application = await createApplication(
      userId,
      jobId
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to apply for job",
    });
  }
};


export const getMyApplicationList = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const applications = await getMyApplications(userId);

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch applications",
    });
  }
};


export const getRecruiterApplicationList = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiterId = req.user.id;

    const applications = await getRecruiterApplications(
      recruiterId
    );

    return res.status(200).json({
      success: true,
      message: "Recruiter applications fetched successfully",
      data: applications,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error.message || "Failed to fetch recruiter applications",
    });
  }
};