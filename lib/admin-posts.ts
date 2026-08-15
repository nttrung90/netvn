import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export async function getAdminPosts(): Promise<Post[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(id,name,slug,color)")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((post) => ({ ...post, category: Array.isArray(post.category) ? post.category[0] ?? null : post.category })) as Post[];
}

export async function getAdminPost(id: string): Promise<Post | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(id,name,slug,color)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return { ...data, category: Array.isArray(data.category) ? data.category[0] ?? null : data.category } as Post;
}
