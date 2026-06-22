export const BASE_URL = "http://localhost:8081";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function request(url, options = {}) {
  const config = { headers: authHeaders(), ...options };
  const response = await fetch(`${BASE_URL}${url}`, config);
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/";
    throw new Error("Unauthorized");
  }
  return response;
}

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${BASE_URL}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(r => r.json()),
  register: (data) =>
    fetch(`${BASE_URL}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
  forgotPassword: (email) =>
    fetch(`${BASE_URL}/api/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).then(r => r.json()),
  verifyOtp: (email, otp) =>
    fetch(`${BASE_URL}/api/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) }).then(r => r.json()),
  resetPassword: (email, otp, newPassword) =>
    fetch(`${BASE_URL}/api/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, newPassword }) }).then(r => r.json()),

  // Profile
  getProfile: () => request("/api/profile/me").then(r => r.json()),
  updateProfile: (data) => request("/api/profile/update", { method: "PUT", body: JSON.stringify(data) }).then(r => r.json()),
  changePassword: (data) => request("/api/profile/change-password", { method: "PUT", body: JSON.stringify(data) }).then(r => r.json()),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${BASE_URL}/api/profile/upload-avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json());
  },

  // Activities
  getActivities: () => request("/api/activities").then(r => r.json()),

  // Notifications
  getNotifications: () => request("/api/notifications").then(r => r.json()),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: "PUT" }).then(r => r.json()),
  markAllNotificationsRead: () => request("/api/notifications/read-all", { method: "PUT" }).then(r => r.json()),

  // Security
  getLoginHistory: () => request("/api/security/login-history").then(r => r.json()),
  getActiveSessions: () => request("/api/security/sessions").then(r => r.json()),
  revokeSession: (id) => request(`/api/security/sessions/${id}`, { method: "DELETE" }).then(r => r.json()),
  toggle2fa: (enabled) => request("/api/security/2fa", { method: "PUT", body: JSON.stringify({ enabled }) }).then(r => r.json()),

  // Admin - Users
  getUsers: () => request("/api/admin/users").then(r => r.json()),
  createUser: (data) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }).then(r => r.json()),
  updateUser: (id, data) => request(`/api/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.json()),
  deleteUser: (id) => request(`/api/admin/users/${id}`, { method: "DELETE" }).then(r => r.json()),
  toggleUserStatus: (id, active) => request(`/api/admin/users/${id}/status?active=${active}`, { method: "PUT" }).then(r => r.json()),
  changeUserRole: (id, role) => request(`/api/admin/users/${id}/role?role=${role}`, { method: "PUT" }).then(r => r.json()),
  resetUserPassword: (id, password) => request(`/api/admin/users/${id}/reset-password?password=${encodeURIComponent(password)}`, { method: "PUT" }).then(r => r.json()),

  // Admin - Roles
  getRoles: () => request("/api/admin/roles").then(r => r.json()),
  createRole: (data) => request("/api/admin/roles", { method: "POST", body: JSON.stringify(data) }).then(r => r.json()),
  updateRole: (id, data) => request(`/api/admin/roles/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.json()),
  deleteRole: (id) => request(`/api/admin/roles/${id}`, { method: "DELETE" }).then(r => r.json()),

  // Admin - Analytics
  getAnalytics: () => request("/api/admin/analytics").then(r => r.json()),

  // Admin - Logs
  getLogs: () => request("/api/admin/logs").then(r => r.json()),

  // Admin - Settings
  getSettings: () => request("/api/admin/settings").then(r => r.json()),
  updateSettings: (data) => request("/api/admin/settings", { method: "PUT", body: JSON.stringify(data) }).then(r => r.json()),

  // Admin - Broadcast
  sendBroadcast: (data) => request("/api/admin/notifications/broadcast", { method: "POST", body: JSON.stringify(data) }).then(r => r.json()),

  // Telemetry
  getTelemetry: () => request("/api/telemetry/latest").then(r => r.json()),

  // Command
  executeCommand: (command) => request("/api/command/execute", { method: "POST", body: JSON.stringify({ command }) }).then(r => r.json()),
};
