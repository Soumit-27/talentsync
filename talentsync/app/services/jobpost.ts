import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "./api";

/* ===========================
   CREATE JOB
=========================== */

export interface CreateJobPayload {
  title: string;
  description: string;
  companyName: string;
  location: string;
  salary?: number;
  experience?: number;
  skills: string[];
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
}

export interface Job {
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

export interface CreateJobResponse {
  success: boolean;
  message: string;
  data: Job;
}

export const createJob = (
  data: CreateJobPayload
): Promise<CreateJobResponse> => {
  return postRequest<CreateJobResponse>(
    "/api/jobs/",
    data
  );
};

/* ===========================
   GET ALL JOBS
=========================== */

export interface GetAllJobsResponse {
  success: boolean;
  data: Job[];
}

export const getAllJobs = (): Promise<GetAllJobsResponse> => {
  return getRequest<GetAllJobsResponse>(
    "/api/jobs/"
  );
};

/* ===========================
   GET JOB BY ID
=========================== */

export interface GetJobResponse {
  success: boolean;
  data: Job;
}

export const getJobById = (
  id: string
): Promise<GetJobResponse> => {
  return getRequest<GetJobResponse>(
    `/api/jobs/${id}`
  );
};

/* ===========================
   UPDATE JOB
=========================== */

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  companyName?: string;
  location?: string;
  salary?: number;
  experience?: number;
  skills?: string[];
  jobType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  status?: "OPEN" | "CLOSED";
}

export interface UpdateJobResponse {
  success: boolean;
  message: string;
  data: Job;
}

export const updateJob = (
  id: string,
  data: UpdateJobPayload
): Promise<UpdateJobResponse> => {
  return putRequest<UpdateJobResponse>(
    `/api/jobs/${id}`,
    data
  );
};

/* ===========================
   DELETE JOB
=========================== */

export interface DeleteJobResponse {
  success: boolean;
  message: string;
}

export const deleteJob = (
  id: string
): Promise<DeleteJobResponse> => {
  return deleteRequest<DeleteJobResponse>(
    `/api/jobs/${id}`
  );
};