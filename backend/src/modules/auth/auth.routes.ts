import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rate-limit";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
const router = Router();
const attempts = rateLimit(20, 15 * 60 * 1000);
router.post("/register", attempts, registerUser);
router.post("/login", attempts, loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticate, getCurrentUser);
router.post("/forgot-password", rateLimit(5, 15 * 60 * 1000), forgotPassword);
router.post("/reset-password", attempts, resetPassword);
export default router;
