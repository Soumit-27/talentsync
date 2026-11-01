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


export const createResetToken = async (
  userId: string,
  tokenHash: string,
  expiresAt: Date
) => {
  return prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
};

export const findResetToken = async (
  tokenHash: string
) => {
  return prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
};

export const deleteResetTokens = async (
  userId: string
) => {
  return prisma.passwordResetToken.deleteMany({
    where: { userId },
  });
};



export const resetPasswordByToken = async (
  tokenHash: string,
  hashedPassword: string
) => {
  return prisma.$transaction(async (tx) => {
    const resetToken = await tx.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken) {
      throw new Error("INVALID_OR_EXPIRED_TOKEN");
    }

    const consumed = await tx.passwordResetToken.deleteMany({
      where: {
        id: resetToken.id,
        expiresAt: { gt: new Date() },
      },
    });

    if (consumed.count !== 1) {
      throw new Error("INVALID_OR_EXPIRED_TOKEN");
    }

    await tx.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await tx.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    return true;
  });
};