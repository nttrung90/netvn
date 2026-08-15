import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPostTable } from "@/components/admin-post-table";
import { AdminSessionActions } from "@/components/admin-session-actions";
import { AuthPanel } from "@/components/auth-panel";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminPosts } from "@/lib/admin-posts";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return <main className="admin-guest"><div className="auth-wrap"><div><span className="eyebrow">Khu vực giới hạn</span><h1 className="article-title">Phòng biên tập.</h1><p className="article-dek">Đăng nhập bằng tài khoản đã được gán role quản trị để quản lý bài viết và ảnh thumbnail.</p><Link className="read-link" style={{ color: "#006d64" }} href="/">← Xem trang công khai</Link></div><AuthPanel /></div></main>;
  const posts = await getAdminPosts();
  return <main className="admin-shell"><header className="admin-header"><Link href="/" className="brand"><span className="brand-mark">T</span><span>Tín Hiệu Số</span></Link><div className="admin-header-actions"><span>{admin.profile.full_name || admin.user.email}</span><Link href="/" className="admin-back">Xem trang</Link><AdminSessionActions /></div></header><AdminPostTable posts={posts} /></main>;
}
