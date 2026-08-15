"use client";

import { ImagePlus, LoaderCircle, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { canUploadThumbnail } from "@/lib/admin-policy";
import { createExcerpt, slugify } from "@/lib/content-utils";
import { buildPostPayload } from "@/lib/post-payload";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Post, PostStatus } from "@/lib/types";

type EditorProps = { post?: Post | null };

export function PostEditor({ post }: EditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url ?? "");
  const [categorySlug, setCategorySlug] = useState(post?.category?.slug ?? CATEGORIES[0].slug);
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const suggestedExcerpt = useMemo(() => createExcerpt(content), [content]);

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    const validation = canUploadThumbnail(file);
    if (!validation.valid) { setError(validation.message); return; }
    setUploading(true); setError("");
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;
    const supabase = createBrowserSupabaseClient();
    const { error: uploadError } = await supabase.storage.from("thumbnails").upload(path, file, { upsert: false, contentType: file.type });
    if (uploadError) { setError(uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
    setThumbnailUrl(data.publicUrl); setUploading(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!title.trim() || !content.trim()) { setError("Tiêu đề và nội dung là bắt buộc."); return; }
    setSaving(true);
    const supabase = createBrowserSupabaseClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) { setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."); setSaving(false); return; }
    const { data: category, error: categoryError } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
    if (categoryError || !category) { setError(categoryError?.message ?? "Không tìm thấy danh mục."); setSaving(false); return; }
    const now = new Date().toISOString();
    const payload = buildPostPayload({ title, slug: post?.slug ?? `${slugify(title)}-${Date.now().toString().slice(-5)}`, excerpt: excerpt || suggestedExcerpt, content, thumbnailUrl, categoryId: category.id, authorId: authData.user.id, authorName: authData.user.user_metadata.full_name || authData.user.email || "Ban biên tập", status, now, existingPublishedAt: post?.published_at });
    const query = post ? supabase.from("posts").update(payload).eq("id", post.id) : supabase.from("posts").insert(payload);
    const { error: saveError } = await query;
    if (saveError) { setError(saveError.message); setSaving(false); return; }
    router.push("/admin"); router.refresh();
  }

  return <form className="editor-form" onSubmit={submit}><div className="editor-head"><div><span className="eyebrow">Tòa soạn</span><h1>{post ? "Chỉnh sửa bài viết" : "Bài viết mới"}</h1></div><div className="editor-head-actions"><select value={status} onChange={(event) => setStatus(event.target.value as PostStatus)} aria-label="Trạng thái bài viết"><option value="draft">Lưu nháp</option><option value="published">Xuất bản</option></select><button className="admin-primary" disabled={saving || uploading} type="submit">{saving ? <LoaderCircle className="spin" size={17} /> : status === "published" ? <Send size={16} /> : <Save size={16} />}{saving ? "Đang lưu" : status === "published" ? "Xuất bản" : "Lưu nháp"}</button></div></div>{error ? <p className="form-error">{error}</p> : null}<div className="editor-grid"><div className="editor-main"><label>Tiêu đề<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Một tiêu đề rõ ràng, giàu tò mò" /></label><label>Tóm tắt <span className="field-note">Không bắt buộc — hệ thống sẽ tạo từ nội dung nếu để trống.</span><textarea rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder={suggestedExcerpt || "Giới thiệu ngắn về bài viết"} /></label><label>Nội dung <span className="field-note">Hỗ trợ Markdown: # tiêu đề, **in đậm**, &gt; trích dẫn.</span><textarea className="content-editor" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Bắt đầu kể câu chuyện của bạn…" /></label></div><aside className="editor-side"><div className="editor-panel"><label>Danh mục<select value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>{CATEGORIES.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label></div><div className="editor-panel"><span className="field-title">Ảnh thumbnail</span><div className="upload-preview">{thumbnailUrl ? <img src={thumbnailUrl} alt="Xem trước thumbnail" /> : <ImagePlus size={25} />}</div><label className="upload-control"><ImagePlus size={15} />{uploading ? "Đang tải ảnh…" : "Tải ảnh từ máy"}<input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} /></label><label className="url-field">Hoặc dán URL<input value={thumbnailUrl} onChange={(event) => setThumbnailUrl(event.target.value)} placeholder="https://..." /></label></div></aside></div></form>;
}
