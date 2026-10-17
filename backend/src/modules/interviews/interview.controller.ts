import { Request, Response } from "express";

import {
  createInterview,
  getMyInterviews,
  getRecruiterInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "./interview.service";

import {
  createInterviewSchema,
  updateInterviewSchema,
} from "./interview.validation";

/* =====================================================
   CREATE INTERVIEW
===================================================== */

export const scheduleInterview = async (req: Request, res: Response) => {
  try {
    const data = createInterviewSchema.parse(req.body);

    const recruiterId = req.user.id;

    const interview = await createInterview(
      recruiterId,
      data.applicationId,
      data.scheduledAt,
      data.meetingLink,
      data.notes,
    );

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      data: interview,
    });
  } catch (error: any) {
    console.error("Schedule interview error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to schedule interview",
    });
  }
};

/* =====================================================
   GET MY INTERVIEWS
   CANDIDATE
===================================================== */

export const getMyInterviewList = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const interviews = await getMyInterviews(userId);

    return res.status(200).json({
      success: true,
      message: "My interviews fetched successfully",
      data: interviews,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch interviews",
    });
  }
};

/* =====================================================
   GET RECRUITER INTERVIEWS
===================================================== */

export const getRecruiterInterviewList = async (
  req: Request,
  res: Response,
) => {
  try {
    const recruiterId = req.user.id;

    const interviews = await getRecruiterInterviews(recruiterId);

    return res.status(200).json({
      success: true,
      message: "Recruiter interviews fetched successfully",
      data: interviews,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch recruiter interviews",
    });
  }
};

/* =====================================================
   GET SINGLE INTERVIEW
===================================================== */

export const getSingleInterview = async (req: Request, res: Response) => {
  try {
    const recruiterId = req.user.id;

    const interviewId = String(req.params.id);

    const interview = await getInterviewById(recruiterId, interviewId);

    return res.status(200).json({
      success: true,
      message: "Interview fetched successfully",
      data: interview,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch interview",
    });
  }
};

/* =====================================================
   UPDATE INTERVIEW
===================================================== */

export const editInterview = async (req: Request, res: Response) => {
  try {
    const data = updateInterviewSchema.parse(req.body);

    const recruiterId = req.user.id;

    const interviewId = String(req.params.id);

    const interview = await updateInterview(recruiterId, interviewId, data);

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      data: interview,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update interview",
    });
  }
};

/* =====================================================
   DELETE INTERVIEW
===================================================== */

export const removeInterview = async (req: Request, res: Response) => {
  try {
    const recruiterId = req.user.id;

    const interviewId = String(req.params.id);

    const interview = await deleteInterview(recruiterId, interviewId);

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
      data: interview,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete interview",
    });
  }
};
