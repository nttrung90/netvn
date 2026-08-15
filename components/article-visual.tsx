import type { Post } from "@/lib/types";

type Variant = "card" | "hero" | "article" | "side" | "feature";

export function ArticleVisual({ post, variant = "card" }: { post: Post; variant?: Variant }) {
  if (post.thumbnail_url) return <img className={`article-image article-image-${variant}`} src={post.thumbnail_url} alt="" />;
  const hue = post.category?.color ?? "#8de6c5";
  return <div className={`editorial-visual editorial-visual-${variant}`} style={{ "--visual-accent": hue } as React.CSSProperties} aria-hidden="true"><span className="visual-orbit" /><span className="visual-rules" /><span className="visual-caption">SIGNAL / {post.category?.slug?.toUpperCase() ?? "NOTES"}</span></div>;
}
