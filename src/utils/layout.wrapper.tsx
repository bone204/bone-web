"use client";

import { usePathname } from "next/navigation";
import AppHeader from "@/components/app.header";
import AppFooter from "@/components/app.footer";
import { AuthGuard } from "@/utils/auth.guard";
import { isFullscreenRoute } from "@/config/routes.config";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = isFullscreenRoute(pathname || "");

  return (
    <>
      {!isFullscreen && <AppHeader />}
      <main className={`app-shell ${isFullscreen ? "app-shell--fullscreen" : ""}`}>
        <AuthGuard>{children}</AuthGuard>
      </main>
      {!isFullscreen && <AppFooter />}
    </>
  );
}

