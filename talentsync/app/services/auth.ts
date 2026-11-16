import { postRequest, getRequest } from "./api";
import type { Company } from "./company";
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  profileCompleted: boolean;
  createdAt: string;
  company: Company | null;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  user: SessionUser;
}
export interface GetLoginUserResponse {
  success: boolean;
  user: SessionUser;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
  user: Pick<SessionUser, "id" | "name" | "email" | "role">;
}
export const loginUser = (data: LoginPayload) =>
  postRequest<LoginResponse>("/api/auth/login", data);
export const logoutUser = () =>
  postRequest<{ success: boolean }>("/api/auth/logout");
export const registerUser = (data: RegisterPayload) =>
  postRequest<RegisterResponse>("/api/auth/register", data);
export const getLoginUser = () =>
  getRequest<GetLoginUserResponse>("/api/auth/me");
export function userHome(user: SessionUser) {
  return user.role === "CANDIDATE"
    ? user.profileCompleted
      ? "/candidateDashboard"
      : "/candidate/profile"
    : user.company
      ? "/dashboard"
      : "/recruiter/company";
}
export interface ForgotPasswordPayload {
  email: string;
}
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
export const resetPasswordLink = (data: ForgotPasswordPayload) =>
  postRequest<ForgotPasswordResponse>("/api/auth/forgot-password", data);
export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}
export const resetPassword = (data: ResetPasswordPayload) =>
  postRequest<ForgotPasswordResponse>("/api/auth/reset-password", data);
