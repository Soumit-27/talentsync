import prisma from "../../lib/prisma";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { ProfileInput } from "./profile.validation";
import { HttpError } from "../../lib/errors";
export const createProfile = (userId: string, data: ProfileInput) =>
  prisma.$transaction(async (tx) => {
    const profile = await tx.candidateProfile.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
    await tx.user.update({
      where: { id: userId },
      data: { profileCompleted: true },
    });
    return profile;
  });
export const getProfile = (userId: string) =>
  prisma.candidateProfile.findUnique({ where: { userId } });
export const updateProfile = createProfile;
export const deleteProfile = (userId: string) =>
  prisma.$transaction(async (tx) => {
    await tx.candidateProfile.delete({ where: { userId } });
    await tx.user.update({
      where: { id: userId },
      data: { profileCompleted: false },
    });
  });
export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
) => {
  if (!(await getProfile(userId)))
    throw new HttpError(409, "Save your profile before uploading your resume.");
  if (file.buffer.subarray(0, 5).toString() !== "%PDF-")
    throw new HttpError(400, "Upload a valid PDF document.");
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  )
    throw new HttpError(
      503,
      "Resume uploads are temporarily unavailable. Please try again later.",
    );
  const resumeUrl = await uploadToCloudinary(
    file.buffer,
    "talentsync/resumes",
    userId + "-resume",
  );
  return prisma.candidateProfile.update({
    where: { userId },
    data: { resumeUrl },
  });
};
