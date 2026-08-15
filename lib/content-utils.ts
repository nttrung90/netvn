export function slugify(input: string) {
  return input
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createExcerpt(content: string, length = 170) {
  const plainText = content
    .replace(/[#*_>`\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length <= length ? plainText : `${plainText.slice(0, length).trimEnd()}…`;
}

export function formatDate(value: string | null) {
  if (!value) return "Bản nháp";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
