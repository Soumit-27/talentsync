import { Request, Response } from "express";
import { findUserById } from "./auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { createResetToken, deleteResetTokens, resetPasswordByToken } from "./auth.service";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail
} from "./auth.service";

import {
  registerSchema,
  loginSchema
} from "./auth.validation";

export const registerUser = async (
  req: Request,
  res: Response
) => {

  console.log("========== REGISTER REQUEST ==========");
  console.log("Request Body:", req.body);

  try {

    const validatedData =
      registerSchema.parse(req.body);

    console.log("Validated Data:", validatedData);

    const {
      name,
      email,
      password,
      role
    } = validatedData;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Role:", role);

    const existingUser =
      await findUserByEmail(email);

    console.log("Existing User:", existingUser);

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    console.log("Password Hashed Successfully");

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log("User Created:", user);

    res.status(201).json({

      success: true,

      message: "User registered successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.error("========== REGISTER ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {

  console.log("========== LOGIN REQUEST ==========");
  console.log("Request Body:", req.body);

  try {

    const validatedData =
      loginSchema.parse(req.body);

    console.log("Validated Data:", validatedData);

    const {
      email,
      password
    } = validatedData;

    const user =
      await findUserByEmail(email);

    console.log("User Found:", user);

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });

    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log("Password Match:", isPasswordValid);

    if (!isPasswordValid) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    );

    console.log("JWT Token Generated");

    res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.error("========== LOGIN ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};


export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await findUserById(req.user!.id);
    console.log(user, "hgdsfhjsdfhdhfdhfjh")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const schema = z.object({
      email: z.string().email(),
    });

    const { email } = schema.parse(req.body);

    const user = await findUserByEmail(email);

    // Always return the same response for privacy.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the email exists, a reset link will be sent.",
      });
    }

    // Generate a secure random token.
    const token = crypto.randomBytes(32).toString("hex");

    // Save only the hashed token in the database.
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Remove previous reset tokens.
    await deleteResetTokens(user.id);

    // Token expires in 15 minutes.
    await createResetToken(
      user.id,
      tokenHash,
      new Date(Date.now() + 15 * 60 * 1000)
    );

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your TalentSync password",
      text: `Click this link to reset your password: ${resetLink}\n\nThis link expires in 15 minutes.`,
    });

    return res.status(200).json({
      success: true,
      message:
        "If the email exists, a reset link will be sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your request.",
    });
  }
};



export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const schema = z.object({
      token: z.string().min(1),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
    }).refine(
      (data) => data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );

    const { token, password } = schema.parse(req.body);

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const hashedPassword = await bcrypt.hash(password, 12);

    await resetPasswordByToken(tokenHash, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login.",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues[0]?.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_OR_EXPIRED_TOKEN"
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or expired.",
      });
    }

    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
    });
  }
};