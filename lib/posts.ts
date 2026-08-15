import { DEMO_POSTS } from "@/lib/demo-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

function mapPost(raw: any): Post {
  const category = Array.isArray(raw.category) ? raw.category[0] ?? null : raw.category ?? null;
  return { ...raw, category } as Post;
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*, category:categories(id,name,slug,color)")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error || !data?.length) return DEMO_POSTS;
    return data.map(mapPost);
  } catch {
    return DEMO_POSTS;
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(id,name,slug,color)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (data) return mapPost(data);
  } catch {
    // The editorial preview remains available before Supabase is configured.
  }
  return DEMO_POSTS.find((post) => post.slug === slug) ?? null;
}

export async function getPostsByCategory(slug: string) {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.category?.slug === slug);
}

export async function searchPublishedPosts(query: string) {
  const normalized = query.trim().toLocaleLowerCase("vi");
  const posts = await getPublishedPosts();
  if (!normalized) return posts;
  return posts.filter((post) =>
    [post.title, post.excerpt, post.content, post.category?.name ?? ""]
      .join(" ")
      .toLocaleLowerCase("vi")
      .includes(normalized),
  );
}
