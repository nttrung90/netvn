import Link from "next/link";
import { ArticleVisual } from "@/components/article-visual";
import { ArticleList } from "@/components/article-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatDate } from "@/lib/content-utils";
import { getPublishedPosts } from "@/lib/posts";

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const [lead, ...rest] = posts;
  const sidePosts = rest.slice(0, 2);
  const listPosts = rest.slice(2);
  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell page-intro">
          <div><span className="eyebrow">Tạp chí công nghệ</span><h1 className="display-title">Công nghệ, đọc bằng một nhịp chậm hơn.</h1></div>
          <p className="intro-note">Chọn lọc những ý tưởng, thiết bị và chuyển động đáng chú ý trong một thế giới luôn kết nối.</p>
        </section>
        {lead ? <section className="shell hero-grid">
          <article className="hero-card">
            <ArticleVisual post={lead} variant="hero" />
            <div className="hero-content">
              {lead.category ? <Link href={`/chuyen-muc/${lead.category.slug}`} className="article-category">{lead.category.name}</Link> : null}
              <h2 className="hero-title"><Link href={`/bai-viet/${lead.slug}`}>{lead.title}</Link></h2>
              <div className="article-meta"><span>{lead.author_name}</span><span>{formatDate(lead.published_at)}</span></div>
            </div>
          </article>
          <div className="side-stack">{sidePosts.map((post) => <article className="side-card" key={post.id}>
            <Link href={`/bai-viet/${post.slug}`}><ArticleVisual post={post} variant="side" /></Link>
            <div className="side-card-copy">
              {post.category ? <Link href={`/chuyen-muc/${post.category.slug}`} className="article-category" style={{ color: post.category.color }}>{post.category.name}</Link> : null}
              <h3><Link href={`/bai-viet/${post.slug}`}>{post.title}</Link></h3>
              <div className="article-meta"><span>{formatDate(post.published_at)}</span></div>
            </div>
          </article>)}</div>
        </section> : null}
        <section className="shell">
          <div className="section-heading"><h2>Mới nhất</h2><Link href="/tim-kiem">Khám phá lưu trữ</Link></div>
          <ArticleList posts={listPosts} />
        </section>
        {posts[3] ? <section className="featured-band"><div className="shell">
          <div className="section-heading"><h2>Chuyện của tuần</h2><Link href={`/bai-viet/${posts[3].slug}`}>Đọc bài viết</Link></div>
          <div className="featured-strip">
            <ArticleVisual post={posts[3]} variant="feature" />
            <div className="featured-copy"><h2>{posts[3].title}</h2><p>{posts[3].excerpt}</p><Link href={`/bai-viet/${posts[3].slug}`} className="read-link">Tiếp tục đọc</Link></div>
            <div className="article-meta"><span>{posts[3].author_name}</span><span>{formatDate(posts[3].published_at)}</span></div>
          </div>
        </div></section> : null}
      </main>
      <SiteFooter />
    </>
  );
}
