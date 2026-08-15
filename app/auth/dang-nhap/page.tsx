```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signIn() {
    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();

      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        if (
          authError.message.toLowerCase().includes("invalid login credentials")
        ) {
          setError("Email hoặc mật khẩu không chính xác.");
        } else {
          setError(authError.message);
        }

        setIsLoading(false);
        return;
      }

      // Đăng nhập thành công
      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Không thể đăng nhập. Hãy kiểm tra kết nối và cấu hình Supabase."
      );
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn();
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
            Khu vực này dành cho thành viên được phân quyền quản trị. Chỉ tài
            khoản có role{" "}
            <code className="mx-1 rounded bg-[#e8efed] px-1.5 py-0.5 text-sm text-[#122b29]">
              admin
            </code>
            mới có thể tạo, sửa hoặc xóa bài viết.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#122b29]"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                className="w-full rounded-xl border border-[#d8d7cf] bg-[#fafaf8] px-4 py-3 text-sm outline-none transition placeholder:text-[#9aa3a1] focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#122b29]"
              >
                Mật khẩu
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
                className="w-full rounded-xl border border-[#d8d7cf] bg-[#fafaf8] px-4 py-3 text-sm outline-none transition placeholder:text-[#9aa3a1] focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#0e2e2b] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#006d64] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {error ? (
            <p
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <p className="mt-6 text-center text-xs leading-5 text-[#697472]">
            Tài khoản và mật khẩu được xác thực an toàn thông qua Supabase
            Authentication.
          </p>
        </section>
      </div>
    </main>
  );
}
```
