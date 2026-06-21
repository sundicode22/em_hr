"use client";

import { Button } from "@/components/ui/button";
import { useMe, useLogout } from "@/hooks/api/use-auth";

export default function ProfilePage() {
  const { data: me } = useMe();
  const logout = useLogout();

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Profile</h1>
      {me && (
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{me.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{me.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Roles</dt>
            <dd className="font-medium">{me.roles.join(", ")}</dd>
          </div>
        </dl>
      )}
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        Sign out
      </Button>
    </div>
  );
}
