import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tín Hiệu Số — Tạp chí công nghệ",
  description: "Những góc nhìn điềm tĩnh về công nghệ, khoa học và đời sống số.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
