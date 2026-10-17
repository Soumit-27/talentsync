import { getRequest, postRequest } from "./api";


export interface InterviewJob {
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

export interface InterviewCandidate {
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
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InterviewApplication {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  job: InterviewJob;
  candidate: InterviewCandidate;
}

export interface RecruiterInterview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  meetingLink: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  application: InterviewApplication;
}



/* ===========================
   SCHEDULE INTERVIEW
=========================== */

export interface ScheduleInterviewPayload {
  applicationId: string;
  scheduledAt: string;
  meetingLink: string;
  notes: string;
}

export interface ScheduleInterviewResponse {
  success: boolean;
  message: string;
  data: RecruiterInterview;
}

export const scheduleInterview = (
  payload: ScheduleInterviewPayload
): Promise<ScheduleInterviewResponse> => {
  return postRequest<ScheduleInterviewResponse>(
    "/api/interviews",
    payload
  );
};

/* ===========================
   GET RECRUITER INTERVIEWS
=========================== */

export interface GetRecruiterInterviewsResponse {
  success: boolean;
  message: string;
  data: RecruiterInterview[];
}

export const getRecruiterInterviews =
  (): Promise<GetRecruiterInterviewsResponse> => {
    return getRequest<GetRecruiterInterviewsResponse>(
      "/api/interviews/recruiter"
    );
  };