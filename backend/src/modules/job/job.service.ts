import prisma from "../../lib/prisma";
import { CreateJobInput } from "./job.validation";

export const createJobService = async (
  data: CreateJobInput,
  recruiterId: string
) => {
  return prisma.job.create({
    data: {
      ...data,
      recruiterId,
    },
  });
};

export const getAllJobsService = async () => {
  return prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getJobByIdService = async (id: string) => {
  return prisma.job.findUnique({
    where: {
      id,
    },
  });
};

export const updateJobService = async (
  id: string,
  data: Partial<CreateJobInput>
) => {
  return prisma.job.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteJobService = async (id: string) => {
  return prisma.job.delete({
    where: {
      id,
    },
  });
};