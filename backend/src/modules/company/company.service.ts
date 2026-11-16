import prisma from "../../lib/prisma";
import { z } from "zod";
import { createCompanySchema } from "./company.validation";
export const createCompany = (
  recruiterId: string,
  data: z.infer<typeof createCompanySchema>,
) => prisma.company.create({ data: { ...data, recruiterId } });
export const getMyCompany = (recruiterId: string) =>
  prisma.company.findUnique({ where: { recruiterId } });
