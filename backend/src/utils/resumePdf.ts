import { Response } from "express";
import { HttpError } from "../lib/errors";

const maxBytes = 5 * 1024 * 1024;

export async function sendResumePdf(
  res: Response,
  resumeUrl: string | null | undefined,
) {
  if (!resumeUrl) throw new HttpError(404, "No resume has been uploaded.");
  let url: URL;
  try {
    url = new URL(resumeUrl);
  } catch {
    throw new HttpError(502, "The saved resume link is invalid.");
  }
  // Only retrieve stored Cloudinary upload URLs; never proxy arbitrary hosts or redirects.
  if (
    url.protocol !== "https:" ||
    url.hostname !== "res.cloudinary.com" ||
    url.port ||
    url.username ||
    url.password ||
    !/^\/[^/]+\/(raw|image)\/upload\//.test(url.pathname)
  ) {
    throw new HttpError(502, "The saved resume link is not supported.");
  }
  let pdf: Buffer;
  try {
    const response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok || !response.body)
      throw new Error("Resume is unavailable");
    const length = Number(response.headers.get("content-length"));
    if (length > maxBytes) {
      await response.body.cancel();
      throw new Error("Resume is too large");
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel();
          throw new Error("Resume is too large");
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    pdf = Buffer.concat(chunks);
    if (pdf.subarray(0, 5).toString() !== "%PDF-")
      throw new Error("Invalid PDF");
  } catch {
    throw new HttpError(
      502,
      "The resume could not be loaded. Please try again or upload the PDF again.",
    );
  }
  // Older Cloudinary raw assets can have attachment/octet-stream metadata.
  // Normalize the response so the browser opens its PDF viewer instead of downloading.
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.send(pdf);
}
