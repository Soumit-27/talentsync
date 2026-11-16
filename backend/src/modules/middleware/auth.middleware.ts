import crypto from "crypto";
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import prisma from "../../lib/prisma";
export interface AuthRequest extends Request {
  file?: Express.Multer.File;
}
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;
  const token = bearer?.startsWith("Bearer ")
    ? bearer.slice(7)
    : req.cookies?.talentsync_session;
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Please log in to continue." });
    return;
  }
  let decoded: JwtPayload;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: ["HS256"],
    });
    if (typeof payload === "string" || typeof payload.id !== "string")
      throw new Error("Invalid session");
    decoded = payload;
  } catch {
    res
      .status(401)
      .json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, password: true },
    });
    if (
      !user ||
      decoded.credential !==
        crypto.createHash("sha256").update(user.password).digest("hex")
    ) {
      res
        .status(401)
        .json({
          success: false,
          message: "Your session has expired. Please log in again.",
        });
      return;
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};
export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({
          success: false,
          message: "You do not have access to this action.",
        });
      return;
    }
    next();
  };
