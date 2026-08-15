import Link from "next/link";
import { ArticleVisual } from "@/components/article-visual";
import { formatDate } from "@/lib/content-utils";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <Link href={`/bai-viet/${post.slug}`} className="post-card-image" aria-label={post.title}>
        <ArticleVisual post={post} />
      </Link>
      <div className="post-card-copy">
        {post.category ? <Link href={`/chuyen-muc/${post.category.slug}`} className="article-category" style={{ color: post.category.color }}>{post.category.name}</Link> : null}
        <h3><Link href={`/bai-viet/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="article-meta"><span>{post.author_name}</span><span>{formatDate(post.published_at)}</span></div>
      </div>
    </article>
  );
}
