import { describe, expect, it } from "vitest";
import { canManagePosts, canUploadThumbnail } from "@/lib/admin-policy";
import { buildPostPayload } from "@/lib/post-payload";

describe("admin policy", () => {
  it("chỉ cho phép admin quản lý bài viết", () => {
    expect(canManagePosts("admin")).toBe(true);
    expect(canManagePosts("editor")).toBe(false);
    expect(canManagePosts("user")).toBe(false);
    expect(canManagePosts(null)).toBe(false);
  });

  it("chỉ nhận thumbnail là ảnh không vượt 5 MB", () => {
    expect(canUploadThumbnail({ type: "image/png", size: 1200 })).toEqual({ valid: true });
    expect(canUploadThumbnail({ type: "application/pdf", size: 1200 })).toMatchObject({ valid: false });
    expect(canUploadThumbnail({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toMatchObject({ valid: false });
  });
});

describe("post payload", () => {
  it("xuất bản bài mới và bảo toàn thời điểm xuất bản khi chỉnh sửa", () => {
    const base = { title: "  Tin mới  ", slug: "tin-moi", excerpt: "  Tóm tắt  ", content: "  Nội dung  ", thumbnailUrl: "", categoryId: "cat-1", authorId: "user-1", authorName: "Ban biên tập", status: "published" as const, now: "2026-08-12T00:00:00.000Z" };
    expect(buildPostPayload(base)).toMatchObject({ title: "Tin mới", excerpt: "Tóm tắt", content: "Nội dung", thumbnail_url: null, published_at: base.now });
    expect(buildPostPayload({ ...base, existingPublishedAt: "2026-08-01T00:00:00.000Z" }).published_at).toBe("2026-08-01T00:00:00.000Z");
    expect(buildPostPayload({ ...base, status: "draft" }).published_at).toBeNull();
  });
});
