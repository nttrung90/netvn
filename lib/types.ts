export type Category = {
  id?: string;
  name: string;
  slug: string;
  color: string;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  author_name: string;
  category: Category | null;
  category_id?: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  thumbnail_url?: string | null;
  category_slug: string;
  status: PostStatus;
};
