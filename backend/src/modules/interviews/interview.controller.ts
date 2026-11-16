import { Request, Response } from "express";
import { z } from "zod";
import * as interviews from "./interview.service";
import {
  createInterviewSchema,
  updateInterviewSchema,
} from "./interview.validation";
const id = (req: Request) => z.string().uuid().parse(req.params.id);
export const scheduleInterview = async (req: Request, res: Response) => {
  const data = createInterviewSchema.parse(req.body);
  res
    .status(201)
    .json({
      success: true,
      message: "Interview scheduled",
      data: await interviews.createInterview(
        req.user.id,
        data.applicationId,
        data.scheduledAt,
        data.meetingLink,
        data.notes,
      ),
    });
};
export const getMyInterviewList = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: await interviews.getMyInterviews(req.user.id),
  });
};
export const getRecruiterInterviewList = async (
  req: Request,
  res: Response,
) => {
  res.json({
    success: true,
    data: await interviews.getRecruiterInterviews(req.user.id),
  });
};
export const getSingleInterview = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: await interviews.getInterviewById(req.user.id, id(req)),
  });
};
export const editInterview = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Interview updated",
    data: await interviews.updateInterview(
      req.user.id,
      id(req),
      updateInterviewSchema.parse(req.body),
    ),
  });
};
export const removeInterview = async (req: Request, res: Response) => {
  await interviews.deleteInterview(req.user.id, id(req));
  res.json({ success: true, message: "Interview deleted" });
};
