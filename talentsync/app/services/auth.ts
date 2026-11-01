import { postRequest, getRequest, deleteRequest, putRequest } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;

  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface GetLoginUserResponse {
  success: boolean;

  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileCompleted: boolean;
    createdAt: string;
  };
}

export const loginUser = (data: LoginPayload): Promise<LoginResponse> => {
  return postRequest<LoginResponse>("api/auth/login", data);
};

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;

  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const registerUser = (
  data: RegisterPayload,
): Promise<RegisterResponse> => {
  return postRequest<RegisterResponse>("/api/auth/register", data);
};

export const getLoginUser = (): Promise<GetLoginUserResponse> => {
  return getRequest<GetLoginUserResponse>("/api/auth/me");
};


export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}



export const resetPasswordLink = (
  data: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  return postRequest<ForgotPasswordResponse>(
    "/api/auth/forgot-password",
    data
  );
};

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export const resetPassword = (
  data: ResetPasswordPayload
): Promise<ForgotPasswordResponse> => {
  return postRequest<ForgotPasswordResponse>(
    "/api/auth/reset-password",
    data
  );
};