export type AppRole = "admin" | "teacher" | "student";

export type Profile = {
  id: string;
  role: AppRole;
  display_name: string;
  avatar_path: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type AuthUserWithProfile = {
  id: string;
  email: string | null;
  profile: Profile;
};
