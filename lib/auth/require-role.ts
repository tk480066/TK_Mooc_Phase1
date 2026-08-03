import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, AuthUserWithProfile, Profile } from "@/lib/types";

export async function getCurrentUser(): Promise<AuthUserWithProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, display_name, avatar_path, status, created_at, updated_at")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;
  if (error || !profile || profile.status !== "active") return null;

  return {
    id: user.id,
    email: user.email ?? null,
    profile,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(...roles: AppRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.profile.role)) redirect("/unauthorized");
  return user;
}
