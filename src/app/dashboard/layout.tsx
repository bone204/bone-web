"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "./components/dashboard.header";
import { DashboardSidebar } from "./components/dashboard.sidebar";
import { getAccessToken, isTokenValid, logout, getProfile, type UserProfile } from "@/services/auth.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      
      if (!token || !isTokenValid(token)) {
        logout();
        router.replace("/");
        return;
      }

      try {
        const userProfile = await getProfile();
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to get profile:", error);
        logout();
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout-v2">
      <DashboardSidebar />
      <div className="dashboard-main-container">
        <DashboardHeader user={user} />
        <main className="dashboard-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
