import prisma from "../../lib/prisma";
import { z } from "zod";
import { CreateJobInput, updateJobSchema } from "./job.validation";
import { HttpError } from "../../lib/errors";
export const createJobService = async (
  data: CreateJobInput,
  recruiterId: string,
) => {
  const company = await prisma.company.findUnique({ where: { recruiterId } });
  if (!company)
    throw new HttpError(
      409,
      "Create your company profile before posting a job.",
    );
  return prisma.job.create({
    data: { ...data, companyName: company.name, recruiterId },
  });
};
export const getAllJobsService = () =>
  prisma.job.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
  });
export const getJobByIdService = (id: string) =>
  prisma.job.findUnique({ where: { id } });
export const updateJobService = (
  id: string,
  recruiterId: string,
  data: z.infer<typeof updateJobSchema>,
) => {
  const { companyName: _companyName, ...safeData } = data;
  return prisma.job.update({ where: { id, recruiterId }, data: safeData });
};
export const deleteJobService = (id: string, recruiterId: string) =>
  prisma.job.delete({ where: { id, recruiterId } });
export const getMyJobsService = (recruiterId: string) =>
  prisma.job.findMany({
    where: { recruiterId },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
