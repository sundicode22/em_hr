"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { useGoogleSignIn, useLogin } from "@/hooks/api/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/login.schema";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const googleSignIn = useGoogleSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      await login.mutateAsync(values);
    } catch {
      setApiError("Invalid email or password");
    }
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)]",
        className,
      )}
      {...props}
    >
      <div className="grid grid-cols-2 border-b border-border/80">
        <div className="flex items-center justify-center gap-2 border-b-2 border-foreground py-4 text-sm font-semibold text-foreground">
          <HugeiconsIcon icon={Login01Icon} strokeWidth={2} className="size-4" />
          Login
        </div>
        <div
          className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-muted-foreground"
          title="Accounts are provisioned by your administrator"
        >
          <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
          Sign Up
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5 p-6">
        {apiError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {apiError}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            aria-invalid={!!errors.email}
            className="h-11 bg-white shadow-none"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              Password
            </Label>
            <button
              type="button"
              className="text-xs font-semibold text-foreground hover:underline"
              tabIndex={-1}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              className="h-11 bg-white pr-10 shadow-none"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={login.isPending} size="lg" className="h-11 w-full">
          {login.isPending ? "Signing in..." : "Log In"}
        </Button>

        <div className="relative py-1">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium tracking-wide text-muted-foreground">
            OR
          </span>
        </div>

        <Button
          variant="outline"
          type="button"
          size="lg"
          className="h-11 w-full"
          disabled={googleSignIn.isPending}
          onClick={() => googleSignIn.mutate()}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>

      <div className="border-t border-border/80 bg-zinc-50 px-6 py-4 text-center text-sm text-muted-foreground">
        Need an account?{" "}
        <span className="font-semibold text-foreground underline underline-offset-2">
          Contact your admin
        </span>
      </div>
    </div>
  );
}
