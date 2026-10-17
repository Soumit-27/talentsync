import { getRequest, postRequest } from "./api";

/* ===========================
   APPLICATION TYPES
=========================== */

export interface AppliedJob {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  salary?: number;
  experience?: number;
  skills: string[];
  jobType: string;
  status: string;
  recruiterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  phone?: string;
  title?: string;
  about?: string;
  experience?: number;
  currentCompany?: string;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: string;
  location?: string;
  preferredLocation?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string | null;
  resumeUrl?: string | null;
  imageUrl?: string | null;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  appliedAt: string;
  updatedAt: string;

  job: AppliedJob;

  candidate?: CandidateProfile;
}

/* ===========================
   GET MY APPLICATIONS
=========================== */

export interface GetMyApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
}

export const getMyApplications =
  (): Promise<GetMyApplicationsResponse> => {
    return getRequest<GetMyApplicationsResponse>(
      "/api/applications/my"
    );
  };

/* ===========================
   APPLY FOR JOB
=========================== */

export interface ApplyJobPayload {
  jobId: string;
}

export interface ApplyJobResponse {
  success: boolean;
  message: string;
  data: Application;
}

export const applyForJob = (
  data: ApplyJobPayload
): Promise<ApplyJobResponse> => {
  return postRequest<ApplyJobResponse>(
    "/api/applications",
    data
  );
};



/* ===========================
   GET RECRUITER APPLICATIONS
=========================== */

export interface GetRecruiterApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
}

export const getRecruiterApplications =
  (): Promise<GetRecruiterApplicationsResponse> => {
    return getRequest<GetRecruiterApplicationsResponse>(
      "/api/applications/recruiter"
    );
  };