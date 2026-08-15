import { describe, expect, it } from "vitest";
import { createExcerpt, formatDate, slugify } from "@/lib/content-utils";

describe("content utilities", () => {
  it("creates URL-friendly Vietnamese slugs", () => {
    expect(slugify("Điện thoại & Máy tính: Góc nhìn mới!")).toBe("dien-thoai-may-tinh-goc-nhin-moi");
  });

  it("returns a compact excerpt from Markdown content", () => {
    expect(createExcerpt("# Tiêu đề\n\nĐây là **một** nội dung có định dạng.", 50)).toBe("Tiêu đề Đây là một nội dung có định dạng.");
  });

  it("formats a publication date in Vietnamese", () => {
    expect(formatDate("2026-08-12T08:00:00.000Z")).toMatch(/12\/08\/2026/);
    expect(formatDate(null)).toBe("Bản nháp");
  });
});
