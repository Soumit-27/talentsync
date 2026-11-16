import { getRequest, postRequest, putRequest } from "./api";
export interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  location: string | null;
}
export interface CompanyPayload {
  name: string;
  description: string;
  website: string;
  location: string;
}
export const getMyCompany = () =>
  getRequest<{ success: boolean; data: Company | null }>("/api/companies/me");
export const createCompany = (payload: CompanyPayload) =>
  postRequest<{ success: boolean; data: Company }>("/api/companies", payload);
export const updateCompany = (payload: CompanyPayload) =>
  putRequest<{ success: boolean; data: Company }>("/api/companies/me", payload);
