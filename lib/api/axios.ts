import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { ApiError, ApiResponse } from "@/types/api";
import { ApiRequestError } from "@/types/api";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    data.success === false
  );
}

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const data = response.data;
    if (isApiError(data)) {
      throw new ApiRequestError(
        data.error.code,
        data.error.message,
        data.error.details,
        response.status,
      );
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const data = error.response?.data;
    if (data && isApiError(data)) {
      throw new ApiRequestError(
        data.error.code,
        data.error.message,
        data.error.details,
        error.response?.status,
      );
    }
    throw new ApiRequestError(
      "NETWORK_ERROR",
      error.message || "Network request failed",
      undefined,
      error.response?.status,
    );
  },
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
  if (data.success) return data.data;
  throw new ApiRequestError("UNKNOWN", "Unexpected response");
}

export async function apiPost<T>(url: string, body?: unknown) {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  if (data.success) return data.data;
  throw new ApiRequestError("UNKNOWN", "Unexpected response");
}

export async function apiPatch<T>(url: string, body?: unknown) {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  if (data.success) return data.data;
  throw new ApiRequestError("UNKNOWN", "Unexpected response");
}
