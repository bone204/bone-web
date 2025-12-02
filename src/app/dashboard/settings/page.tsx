"use client";

export default function SettingsPage() {
  return (
    <div className="dashboard-page-placeholder">
      <h1 className="dashboard-title">Settings</h1>
      <div className="settings-list">
        <div className="setting-item">
            <h3>Profile Settings</h3>
            <p>Update your personal information</p>
        </div>
        <div className="setting-item">
            <h3>Notifications</h3>
            <p>Manage your email preferences</p>
        </div>
        <div className="setting-item">
            <h3>Security</h3>
            <p>Change password and 2FA</p>
        </div>
      </div>
    </div>
  );
}

