import { getRequest, postRequest } from "./api";
import type { CandidateProfile } from "./job_application";
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
export const getProfile = () =>
  getRequest<CandidateProfile | null>("/api/profile");
export const createProfile = (data: CreateProfilePayload) =>
  postRequest<CandidateProfile>("/api/profile", data);
export const uploadResume = (file: File) => {
  const data = new FormData();
  data.append("resume", file);
  return postRequest<{
    success: boolean;
    resumeUrl: string;
    profile: CandidateProfile;
  }>("/api/profile/upload-resume", data);
};
