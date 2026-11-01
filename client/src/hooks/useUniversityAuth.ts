import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { UserRole, UniversitySession } from "@shared/university";
import { toast } from "sonner";

export function useUniversityAuth() {
  const utils = trpc.useUtils();
  const { data: authData, isLoading, refetch } = trpc.university.auth.check.useQuery(undefined, {
    staleTime: 60 * 1000,
    retry: 1,
  });

  const switchRoleMutation = trpc.university.auth.switchRole.useMutation({
    onSuccess: (res) => {
      toast.success(`Active portal switched to: ${res.session.role.toUpperCase()}`);
      utils.university.invalidate();
      refetch();
    },
    onError: (err) => {
      toast.error(`Role switch failed: ${err.message}`);
    },
  });

  const logoutMutation = trpc.university.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Successfully logged out from CAU Portal");
      utils.university.invalidate();
      window.location.href = "/dashboard/login";
    },
    onError: (err) => {
      toast.error(`Logout error: ${err.message}`);
    },
  });

  const role: UserRole = authData?.role ?? "admin";
  const session: UniversitySession | null = authData?.session ?? null;
  const isAuthenticated = authData?.isAuthenticated ?? true;

  const permissions = useMemo(() => {
    return new Set(session?.permissions || []);
  }, [session]);

  const hasPermission = (permission: string) => {
    if (role === "admin") return true;
    return permissions.has(permission);
  };

  const switchRole = (newRole: UserRole) => {
    switchRoleMutation.mutate({ role: newRole });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    role,
    session,
    isAuthenticated,
    isLoading,
    isSwitchingRole: switchRoleMutation.isPending,
    hasPermission,
    switchRole,
    logout,
    refetch,
  };
}
