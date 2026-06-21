"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api/axios";
import type { AuthSessionUser, LoginPayload } from "@/types/auth";

export function useMe() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiGet<AuthSessionUser>("/auth/me"),
    enabled: status === "authenticated",
    initialData: session?.user?.id
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name ?? null,
          image: session.user.image ?? null,
          roles: session.user.roles ?? [],
          permissions: session.user.permissions ?? [],
        }
      : undefined,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/workspace/dashboard");
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      await signIn("google", { callbackUrl: "/workspace/dashboard" });
    },
  });
}
