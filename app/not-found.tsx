import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return <><SiteHeader /><main className="shell content-page"><div className="empty-state"><span className="eyebrow">404</span><h1 style={{ fontFamily: "Georgia, serif", fontSize: "3rem", fontWeight: 500, margin: "0 0 12px" }}>Trang này chưa có tín hiệu.</h1><p>Bài viết bạn tìm kiếm có thể đã được di chuyển hoặc chưa xuất bản.</p><Link href="/" className="read-link" style={{ color: "#006d64" }}>Về trang chủ</Link></div></main></>;
}
