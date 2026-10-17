import { getRequest, postRequest, deleteRequest, putRequest } from "./api";

export interface CreateProfilePayload {
  phone: string;
  title: string;
  about: string;
  experience: number;
  currentCompany: string;
  currentSalary: number;
  expectedSalary: number;
  noticePeriod: string;
  location: string;
  preferredLocation: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export const createProfile = async (data: CreateProfilePayload) => {
  return await postRequest("/api/profile", data);
};

interface UploadResumeResponse {
  resumeUrl: string;
}

export const uploadResume = async (
  file: File,
): Promise<UploadResumeResponse> => {
  const formData = new FormData();
  formData.append("resume", file);

  return await postRequest<UploadResumeResponse>(
    "/api/profile/upload-resume",
    formData,
  );
};
