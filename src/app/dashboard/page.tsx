"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, isTokenValid, logout, getProfile, type UserProfile } from "@/services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      
      // Nếu không có token hoặc token hết hạn, redirect về home
      if (!token || !isTokenValid(token)) {
        logout();
        router.replace("/");
        return;
      }

      // Lấy thông tin user
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

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-page__loading">
          <div className="dashboard-page__spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__container">
        <div className="dashboard-page__header">
          <div>
            <h1 className="dashboard-page__title">Bảng điều khiển</h1>
            <p className="dashboard-page__subtitle">
              Chào mừng trở lại, <strong>{user?.username || "Người dùng"}</strong>!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="dashboard-page__logout-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>

        <div className="dashboard-page__content">
          <div className="dashboard-page__card">
            <h2 className="dashboard-page__card-title">Thông tin tài khoản</h2>
            <div className="dashboard-page__info">
              <div className="dashboard-page__info-item">
                <span className="dashboard-page__info-label">Tên đăng nhập:</span>
                <span className="dashboard-page__info-value">{user?.username || "N/A"}</span>
              </div>
              <div className="dashboard-page__info-item">
                <span className="dashboard-page__info-label">ID người dùng:</span>
                <span className="dashboard-page__info-value">{user?.userId || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-page__card">
            <h2 className="dashboard-page__card-title">Chức năng</h2>
            <p className="dashboard-page__card-description">
              Các chức năng quản lý sẽ được thêm vào đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}