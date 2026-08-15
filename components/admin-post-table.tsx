"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/content-utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Post } from "@/lib/types";

export function AdminPostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  async function removePost(post: Post) {
    if (!confirm(`Xóa “${post.title}”? Thao tác này không thể hoàn tác.`)) return;
    setDeleting(post.id); setError("");
    const supabase = createBrowserSupabaseClient();
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", post.id);
    if (deleteError) setError(deleteError.message); else router.refresh();
    setDeleting(null);
  }
  return <div className="admin-table-wrap"><div className="admin-toolbar"><div><span className="eyebrow">Kho bài viết</span><h1>Biên tập</h1></div><Link href="/admin/bai-viet/moi" className="admin-primary"><Plus size={17} /> Viết bài mới</Link></div>{error ? <p className="form-error">{error}</p> : null}<div className="admin-table"><div className="admin-thead"><span>Bài viết</span><span>Trạng thái</span><span>Cập nhật</span><span /></div>{posts.length ? posts.map((post) => <div className="admin-row" key={post.id}><div className="admin-post-title"><div className="admin-mini-image">{post.thumbnail_url ? <img src={post.thumbnail_url} alt="" /> : null}</div><div><strong>{post.title}</strong><small>{post.category?.name ?? "Chưa phân loại"}</small></div></div><span className={`status-pill ${post.status}`}>{post.status === "published" ? "Đã đăng" : "Bản nháp"}</span><span className="admin-date">{formatDate(post.updated_at)}</span><div className="admin-actions"><Link href={`/admin/bai-viet/${post.id}`} aria-label={`Sửa ${post.title}`}><Pencil size={16} /></Link><button type="button" disabled={deleting === post.id} onClick={() => removePost(post)} aria-label={`Xóa ${post.title}`}><Trash2 size={16} /></button></div></div>) : <div className="empty-state">Bạn chưa có bài viết nào. Hãy bắt đầu với bản nháp đầu tiên.</div>}</div></div>;
}
