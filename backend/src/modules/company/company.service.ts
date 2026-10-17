import prisma from "../../lib/prisma";

interface CreateCompanyData {
  name: string;
  description?: string;
  website?: string;
  location?: string;
}

export const createCompany = async (
  recruiterId: string,
  data: CreateCompanyData
) => {
  const existingCompany = await prisma.company.findUnique({
    where: {
      recruiterId,
    },
  });

  if (existingCompany) {
    throw new Error("Recruiter already has a company");
  }

  const company = await prisma.company.create({
    data: {
      name: data.name,
      description: data.description,
      website: data.website,
      location: data.location,
      recruiterId,
    },
  });

  return company;
};

export const getMyCompany = async (recruiterId: string) => {
  const company = await prisma.company.findUnique({
    where: {
      recruiterId,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return company;
};