import { Router } from "express";
import {
  createCompanyController,
  getMyCompanyController,
} from "./company.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  createCompanyController
);

router.get(
  "/me",
  authenticate,
  getMyCompanyController
);

export default router;