import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { forgotPassword, getCurrentUser } from "./auth.controller";
import { resetPassword } from "./auth.controller";

import {
  registerUser,
  loginUser
} from "./auth.controller";

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);


router.get(
  "/me",
  authenticate,
  getCurrentUser
);


router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;