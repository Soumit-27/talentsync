import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
  timeout: 20000,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/api/auth/")
    ) {
      window.dispatchEvent(new Event("talentsync:session-expired"));
    }
    return Promise.reject(error);
  },
);
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error))
    return (
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "The request took too long. Please try again."
        : "Unable to connect. Please check your connection and try again.")
    );
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
export const getRequest = async <T>(url: string): Promise<T> =>
  (await api.get<T>(url)).data;
export const postRequest = async <T>(url: string, data?: unknown): Promise<T> =>
  (await api.post<T>(url, data)).data;
export const putRequest = async <T>(url: string, data?: unknown): Promise<T> =>
  (await api.put<T>(url, data)).data;
export const patchRequest = async <T>(
  url: string,
  data?: unknown,
): Promise<T> => (await api.patch<T>(url, data)).data;
export const deleteRequest = async <T>(url: string): Promise<T> =>
  (await api.delete<T>(url)).data;
export default api;
