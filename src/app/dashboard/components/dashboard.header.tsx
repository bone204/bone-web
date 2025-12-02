"use client";

import { type UserProfile } from "@/services/auth.service";

type DashboardHeaderProps = {
  user: UserProfile | null;
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header-v2">
      <div className="dashboard-header-v2__search">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="dashboard-header-v2__actions">
        <button className="action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        
        <button className="action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
