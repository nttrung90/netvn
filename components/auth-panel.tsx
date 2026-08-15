"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AuthPanel() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true); setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
      });
      if (authError) setError(authError.message);
    } catch {
      setError("Không thể khởi tạo đăng nhập. Hãy kiểm tra biến môi trường Supabase.");
    } finally { setLoading(false); }
  }

  return <aside className="auth-card"><span className="eyebrow">Bảo mật bởi Supabase</span><h2>Vào khu vực quản trị</h2><p>Đăng nhập với Google OAuth. Chỉ tài khoản có role admin mới có thể tạo, sửa hoặc xóa bài viết.</p><button type="button" className="oauth-button" disabled={loading} onClick={signInWithGoogle}><LogIn size={17} />{loading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}</button>{error ? <p className="form-error">{error}</p> : null}</aside>;
}
