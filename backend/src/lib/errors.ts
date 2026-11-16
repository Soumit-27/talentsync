import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import multer from "multer";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: error.issues[0]?.message ?? "Invalid input",
      errors: error.flatten().fieldErrors,
    });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "This record already exists. Please refresh and try again.",
      });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Record not found or you do not have access.",
      });
      return;
    }
  }
  if (
    error instanceof multer.MulterError ||
    error?.message === "Only PDF files are allowed"
  ) {
    res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume must be 5 MB or smaller."
          : error.message,
    });
    return;
  }
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ success: false, message: "Invalid JSON request." });
    return;
  }

  console.error("Request failed:", {
    name: error instanceof Error ? error.name : "Unknown error",
    message: error instanceof Error ? error.message : String(error),
    code:
      error instanceof Prisma.PrismaClientKnownRequestError
        ? error.code
        : undefined,
    meta:
      error instanceof Prisma.PrismaClientKnownRequestError
        ? error.meta
        : undefined,
    stack: error instanceof Error ? error.stack : undefined,
  });

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
};
