import type { PostStatus } from "@/lib/types";

type PostPayloadInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  status: PostStatus;
  now: string;
  existingPublishedAt?: string | null;
};

export function buildPostPayload(input: PostPayloadInput) {
  return {
    title: input.title.trim(),
    slug: input.slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    thumbnail_url: input.thumbnailUrl || null,
    category_id: input.categoryId,
    author_id: input.authorId,
    author_name: input.authorName,
    status: input.status,
    published_at: input.status === "published" ? input.existingPublishedAt ?? input.now : null,
  };
}
