"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/axios";
import type { PaginatedData } from "@/types/api";
import type { UserPublic } from "@/types/auth";

type UseUsersParams = {
  page?: number;
  limit?: number;
};

export function useUsers({ page = 1, limit = 10 }: UseUsersParams = {}) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () =>
      apiGet<PaginatedData<UserPublic>>("/users", { page, limit }),
  });
}
