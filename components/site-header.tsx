import Link from "next/link";
import { Search } from "lucide-react";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <div className="shell header-main">
          <Link href="/" className="brand" aria-label={`${SITE_NAME} - Trang chủ`}>
            <span className="brand-mark">T</span>
            <span>{SITE_NAME}</span>
          </Link>
          <nav className="nav" aria-label="Điều hướng danh mục">
            {CATEGORIES.slice(0, 4).map((category) => (
              <Link key={category.slug} href={`/chuyen-muc/${category.slug}`}>{category.name}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/tim-kiem" className="icon-link" aria-label="Tìm kiếm bài viết"><Search size={17} /></Link>
            <Link href="/auth/dang-nhap" className="admin-link">Đăng nhập</Link>
          </div>
        </div>
      </header>
      <div className="ticker">
        <div className="shell ticker-inner"><span className="ticker-tag">Góc nhìn mới</span><span className="ticker-copy">Những câu chuyện công nghệ đáng đọc, được chọn lọc cho nhịp sống số hôm nay.</span></div>
      </div>
    </>
  );
}
