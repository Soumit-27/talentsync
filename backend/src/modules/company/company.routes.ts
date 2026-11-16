import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  createCompanyController,
  getMyCompanyController,
  updateCompanyController,
} from "./company.controller";
const router = Router();
router.use(authenticate, authorize("RECRUITER"));
router.get("/me", getMyCompanyController);
router.post("/", createCompanyController);
router.put("/me", updateCompanyController);
export default router;
