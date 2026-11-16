import { Request, Response, CookieOptions } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  createUser,
  findUserByEmail,
  findUserById,
  createResetToken,
  deleteResetTokens,
  resetPasswordByToken,
} from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";
import { HttpError } from "../../lib/errors";
export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAME_SITE === "none" ? "none" : "lax",
    path: "/api",
  };
}
export const registerUser = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  if (await findUserByEmail(data.email))
    throw new HttpError(
      409,
      "An account with this email already exists. Please log in.",
    );
  const user = await createUser({
    ...data,
    password: await bcrypt.hash(data.password, 12),
  });
  res
    .status(201)
    .json({
      success: true,
      message: "Account created. You can now log in.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};
export const loginUser = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await findUserByEmail(data.email);
  if (!user || !(await bcrypt.compare(data.password, user.password)))
    throw new HttpError(401, "Email or password is incorrect.");
  // A password reset invalidates all previously issued sessions.
  const token = jwt.sign(
    {
      id: user.id,
      credential: crypto
        .createHash("sha256")
        .update(user.password)
        .digest("hex"),
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d", algorithm: "HS256" },
  );
  res.cookie("talentsync_session", token, {
    ...sessionCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    success: true,
    message: "Login successful",
    user: await findUserById(user.id),
  });
};
export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("talentsync_session", sessionCookieOptions());
  res.json({ success: true, message: "Logged out successfully" });
};
export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await findUserById(req.user.id);
  if (!user) throw new HttpError(401, "Please log in again.");
  res.json({ success: true, user });
};
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = z
    .object({ email: z.string().trim().toLowerCase().email() })
    .parse(req.body);
  const message =
    "If an account exists for this email, a reset link will be sent.";
  const user = await findUserByEmail(email);
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await deleteResetTokens(user.id);
    await createResetToken(
      user.id,
      tokenHash,
      new Date(Date.now() + 15 * 60 * 1000),
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your TalentSync password",
        text:
          "Reset your password: " +
          process.env.FRONTEND_URL +
          "/reset-password?token=" +
          token +
          "\nThis link expires in 15 minutes.",
      });
    } catch {
      console.error(
        "Password reset email delivery failed. Check email configuration.",
      );
    }
  }
  res.json({ success: true, message });
};
export const resetPassword = async (req: Request, res: Response) => {
  const data = z
    .object({
      token: z.string().regex(/^[a-f0-9]{64}$/, "Invalid reset link."),
      password: z.string().min(8).max(72),
      confirmPassword: z.string(),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    })
    .parse(req.body);
  const tokenHash = crypto
    .createHash("sha256")
    .update(data.token)
    .digest("hex");
  try {
    await resetPasswordByToken(tokenHash, await bcrypt.hash(data.password, 12));
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_OR_EXPIRED_TOKEN")
      throw new HttpError(400, "This reset link is invalid or expired.");
    throw error;
  }
  res.clearCookie("talentsync_session", sessionCookieOptions());
  res.json({
    success: true,
    message: "Password reset. Please log in with your new password.",
  });
};
