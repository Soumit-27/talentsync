import { Router } from "express";

import {
  scheduleInterview,
  getMyInterviewList,
  getRecruiterInterviewList,
  getSingleInterview,
  editInterview,
  removeInterview,
} from "./interview.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();


/* =====================================================
   CREATE
===================================================== */

router.post(
  "/",
  authenticate,
  scheduleInterview
);


/* =====================================================
   CANDIDATE
===================================================== */

router.get(
  "/my",
  authenticate,
  getMyInterviewList
);


/* =====================================================
   RECRUITER
===================================================== */

router.get(
  "/recruiter",
  authenticate,
  getRecruiterInterviewList
);


/* =====================================================
   SINGLE INTERVIEW
===================================================== */

router.get(
  "/:id",
  authenticate,
  getSingleInterview
);


/* =====================================================
   UPDATE
===================================================== */

router.patch(
  "/:id",
  authenticate,
  editInterview
);


/* =====================================================
   DELETE
===================================================== */

router.delete(
  "/:id",
  authenticate,
  removeInterview
);


export default router;