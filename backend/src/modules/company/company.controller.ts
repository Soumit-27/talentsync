import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { createCompany, getMyCompany } from "./company.service";
import { createCompanySchema } from "./company.validation";
export const createCompanyController = async (req: Request, res: Response) => {
  const data = await createCompany(
    req.user.id,
    createCompanySchema.parse(req.body),
  );
  res
    .status(201)
    .json({ success: true, message: "Company created successfully", data });
};
export const getMyCompanyController = async (req: Request, res: Response) => {
  res.json({ success: true, data: await getMyCompany(req.user.id) });
};
export const updateCompanyController = async (req: Request, res: Response) => {
  const payload = createCompanySchema.parse(req.body);
  const data = await prisma.$transaction(async (tx) => {
    const company = await tx.company.update({
      where: { recruiterId: req.user.id },
      data: payload,
    });
    await tx.job.updateMany({
      where: { recruiterId: req.user.id },
      data: { companyName: company.name },
    });
    return company;
  });
  res.json({ success: true, message: "Company updated successfully", data });
};
