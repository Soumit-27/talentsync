import { z } from "zod";
const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254);
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
});
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(72),
});
