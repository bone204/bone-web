"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken, isTokenValid } from "@/services/auth.service";

/**
 * Component để kiểm tra token và redirect đến dashboard nếu đã đăng nhập
 * Chỉ áp dụng cho trang home
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ kiểm tra token ở trang home
    if (pathname === "/") {
      const token = getAccessToken();
      if (token && isTokenValid(token)) {
        // Token hợp lệ, redirect đến dashboard
        router.replace("/dashboard");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}

