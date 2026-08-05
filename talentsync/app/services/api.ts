import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// GET
export const getRequest = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);
  return response.data;
};

// POST
export const postRequest = async <T>(
  url: string,
  data?: unknown
): Promise<T> => {
  const response = await api.post<T>(url, data);
  return response.data;
};

// PUT
export const putRequest = async <T>(
  url: string,
  data?: unknown
): Promise<T> => {
  const response = await api.put<T>(url, data);
  return response.data;
};

// DELETE
export const deleteRequest = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};

export default api;