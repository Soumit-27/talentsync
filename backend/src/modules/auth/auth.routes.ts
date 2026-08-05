import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getCurrentUser } from "./auth.controller";

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

export default router;