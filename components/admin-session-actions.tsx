"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminSessionActions() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setIsSigningOut(true);
    setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Không thể đăng xuất. Vui lòng thử lại.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Không thể kết nối để đăng xuất. Vui lòng thử lại.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return <div className="admin-session-actions"><button className="admin-signout" type="button" disabled={isSigningOut} onClick={signOut}><LogOut size={14} />{isSigningOut ? "Đang đăng xuất" : "Đăng xuất"}</button>{error ? <span className="signout-error" role="alert">{error}</span> : null}</div>;
}
