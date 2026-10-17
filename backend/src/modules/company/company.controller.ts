import { Request, Response } from "express";
import {
  createCompany,
  getMyCompany,
} from "./company.service";
import { createCompanySchema } from "./company.validation";

export const createCompanyController = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiterId = req.user.id;

    const validatedData = createCompanySchema.parse(req.body);

    const company = await createCompany(
      recruiterId,
      validatedData
    );

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyCompanyController = async (
  req: Request,
  res: Response
) => {
  try {
    const recruiterId = req.user.id;

    const company = await getMyCompany(recruiterId);

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};