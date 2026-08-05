import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as profileService from "./profile.service";

export const createProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const profile = await profileService.createProfile(
      userId,
      req.body
    );

    return res.status(201).json(profile);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const profile = await profileService.getProfile(userId);

    return res.status(200).json(profile);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const profile = await profileService.updateProfile(
      userId,
      req.body
    );

    return res.status(200).json(profile);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    await profileService.deleteProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadResume = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const userId = req.user!.id;

    const profile = await profileService.uploadResume(
      userId,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      profile,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};