"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithGoogle() {
    setError("");
    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      }
    } catch {
      setError("Không thể khởi tạo đăng nhập. Hãy kiểm tra biến môi trường Supabase.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-5 py-10 text-[#122b29] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center">
        <section className="w-full rounded-[2rem] border border-[#d8d7cf] bg-white p-7 shadow-[0_22px_60px_rgba(18,43,41,0.10)] sm:p-10">
          <Link
            href="/"
            className="text-sm font-semibold text-[#006d64] underline-offset-4 hover:underline"
          >
            ← Trở về trang chủ
          </Link>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[#006d64]">
            Tòa soạn
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Đăng nhập để biên tập.
          </h1>
          <p className="mt-5 text-base leading-7 text-[#52605e]">
            Khu vực này dành cho thành viên được phân quyền quản trị. Chỉ tài khoản có role
            <code className="mx-1 rounded bg-[#e8efed] px-1.5 py-0.5 text-sm text-[#122b29]">
              admin
            </code>
            mới có thể tạo, sửa hoặc xóa bài viết.
          </p>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#0e2e2b] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#006d64] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
          </button>

          {error ? (
            <p
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <p className="mt-6 text-center text-xs leading-5 text-[#697472]">
            Bằng việc tiếp tục, bạn đồng ý xác thực thông qua Google OAuth do Supabase quản lý.
          </p>
        </section>
      </div>
    </main>
  );
}
