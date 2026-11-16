import { sendResumePdf } from "../../utils/resumePdf";
import { Request, Response } from "express";
import * as profiles from "./profile.service";
import { profileSchema } from "./profile.validation";
import { HttpError } from "../../lib/errors";
export const createProfile = async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      await profiles.createProfile(req.user.id, profileSchema.parse(req.body)),
    );
};
export const getProfile = async (req: Request, res: Response) => {
  res.json(await profiles.getProfile(req.user.id));
};
export const updateProfile = async (req: Request, res: Response) => {
  res.json(
    await profiles.updateProfile(req.user.id, profileSchema.parse(req.body)),
  );
};
export const deleteProfile = async (req: Request, res: Response) => {
  await profiles.deleteProfile(req.user.id);
  res.json({ success: true, message: "Profile deleted successfully" });
};
export const uploadResume = async (req: Request, res: Response) => {
  if (!req.file) throw new HttpError(400, "Select a PDF resume to upload.");
  const profile = await profiles.uploadResume(req.user.id, req.file);
  res.json({
    success: true,
    message: "Resume uploaded successfully",
    resumeUrl: profile.resumeUrl,
    profile,
  });
};

export const viewResume = async (req: Request, res: Response) => {
  const profile = await profiles.getProfile(req.user.id);
  await sendResumePdf(res, profile?.resumeUrl);
};
