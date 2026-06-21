import type {
  ApiError,
  ApiSuccess,
  PaginatedData,
  PaginationMeta,
} from "@/types/api";

export function success<T>(data: T, message?: string): ApiSuccess<T> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function error(
  code: string,
  message: string,
  details?: unknown,
): ApiError {
  return {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
}

export function paginated<T>(
  items: T[],
  meta: PaginationMeta,
  message?: string,
): ApiSuccess<PaginatedData<T>> {
  return success({ items, pagination: meta }, message);
}

export function parsePagination(
  pageRaw?: string | number,
  limitRaw?: string | number,
): { page: number; limit: number; offset: number } {
  const page = Math.max(1, Number(pageRaw) || 1);
  const limit = Math.min(100, Math.max(1, Number(limitRaw) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
