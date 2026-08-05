import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateUserInput {

  name: string;

  email: string;

  password: string;

  role: "CANDIDATE" | "RECRUITER";
}

export const findUserByEmail = async (
  email: string
) => {

  return prisma.user.findUnique({
    where: {
      email
    }
  });

};

export const createUser = async (
  data: CreateUserInput
) => {

  return prisma.user.create({
    data
  });

};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileCompleted: true,
      createdAt: true,
    },
  });
};