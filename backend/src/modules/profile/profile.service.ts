import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const prisma = new PrismaClient();

export const createProfile = async (userId: string, data: any) => {
  const existing = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (existing) {
    throw new Error("Profile already exists");
  }

  return prisma.candidateProfile.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const getProfile = async (userId: string) => {
  return prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });
};

export const updateProfile = async (userId: string, data: any) => {
  return prisma.candidateProfile.update({
    where: {
      userId,
    },
    data,
  });
};

export const deleteProfile = async (userId: string) => {
  return prisma.candidateProfile.delete({
    where: {
      userId,
    },
  });
};

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
) => {
  // Upload to Cloudinary
  const resumeUrl = await uploadToCloudinary(
    file.buffer,
    "talentsync/resumes",
    `${userId}-resume`,
  );

  // Save URL in database
  const profile = await prisma.candidateProfile.update({
    where: {
      userId,
    },
    data: {
      resumeUrl,
    },
  });

  return profile;
};
