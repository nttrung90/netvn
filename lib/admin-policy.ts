export type EditorRole = "admin" | "editor" | "user" | null | undefined;

export function canManagePosts(role: EditorRole) {
  return role === "admin";
}

export function canUploadThumbnail(file: Pick<File, "type" | "size">) {
  if (!file.type.startsWith("image/")) return { valid: false, message: "Chỉ chấp nhận tệp hình ảnh." } as const;
  if (file.size > 5 * 1024 * 1024) return { valid: false, message: "Ảnh cần nhỏ hơn 5 MB." } as const;
  return { valid: true } as const;
}
