import { createServerSupabaseClient } from "@/lib/supabase/server";
import { canManagePosts } from "@/lib/admin-policy";

export async function getCurrentAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !canManagePosts(profile.role)) return null;
  return { user, profile };
}
