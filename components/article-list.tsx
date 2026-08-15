import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/types";

export function ArticleList({ posts }: { posts: Post[] }) {
  if (!posts.length) return <div className="empty-state">Chưa có bài viết phù hợp. Hãy thử một chuyên mục hoặc từ khóa khác.</div>;
  return <div className="post-grid">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>;
}
