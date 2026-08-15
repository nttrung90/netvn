import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand"><span className="brand-mark">T</span><span>{SITE_NAME}</span></Link>
            <p>Một không gian biên tập độc lập dành cho công nghệ, khoa học và những thay đổi đang định hình đời sống số.</p>
          </div>
          <div>
            <div className="footer-label">Chuyên mục</div>
            <div className="footer-links">{CATEGORIES.slice(0, 4).map((category) => <Link key={category.slug} href={`/chuyen-muc/${category.slug}`}>{category.name}</Link>)}</div>
          </div>
          <div>
            <div className="footer-label">Tòa soạn</div>
            <div className="footer-links"><Link href="/tim-kiem">Tìm kiếm</Link><Link href="/auth/dang-nhap">Đăng nhập biên tập</Link><a href="mailto:hello@example.com">Liên hệ</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {SITE_NAME}. Tạp chí công nghệ độc lập.</span><span>Đọc chậm. Nghĩ sâu. Kết nối tốt hơn.</span></div>
      </div>
    </footer>
  );
}
