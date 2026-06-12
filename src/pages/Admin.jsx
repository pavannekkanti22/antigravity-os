import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import {
  Terminal as TerminalIcon,
  Shield,
  Users,
  Power,
  Trash2,
  ShieldAlert,
  Cpu,
  HardDrive,
  Network,
  RefreshCw,
  LogOut,
  Search,
  Check,
  AlertCircle,
  ArrowRight,
  UserCheck,
  UserMinus,
  Activity,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  Pencil,
  BarChart3,
  Database,
  Clock,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

function Admin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [logs, setLogs] = useState([]);
  const [activeSection, setActiveSection] = useState("users");
  const [analytics, setAnalytics] = useState({
    
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0,
    totalLogins: 0,
    totalPasswordResets: 0,
    totalRoleChanges: 0,
    monthlyRegistrations: []
  });

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [cpu, setCpu] = useState(45);
  const [memory, setMemory] = useState(58);
  const [nodes, setNodes] = useState(94);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);

  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalOutputs, setTerminalOutputs] = useState([
    "ANTIGRAVITY CORE SYSTEMS [Version 4.1.0-Secure]",
    "(c) 2026 Antigravity Technologies. All rights reserved.",
    "",
    "Ready for telemetry uplink. Type /help to view command nodes.",
    "",
  ]);
  const [terminalLoading, setTerminalLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const unreadCount = notifications.filter(
  (notification) => !notification.isRead
).length;

  const terminalEndRef = useRef(null);

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const blob = new Blob([dataStr], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  async function loadAnalytics() {
    try {
      const response = await fetch("http://localhost:8081/api/admin/analytics", {
        headers: authHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  }

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8081/api/admin/users", {
        headers: authHeaders,
      });

      if (response.status === 401 || response.status === 403) {
        showToast("Unauthorized. Please login again.", "error");
        localStorage.clear();
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }

const loadNotifications = async () => {
  try {
    const response = await fetch(
      "http://localhost:8081/api/notifications",
      {
        headers: authHeaders,
      }
    );

    const data = await response.json();

    console.log("Notifications:", data);

    setNotifications(data);
  } catch (err) {
    console.error("Failed to load notifications", err);
  }
};
const markAsRead = async (id) => {
  try {
    await fetch(
      `http://localhost:8081/api/notifications/${id}/read`,
      {
        method: "PUT",
        headers: authHeaders,
      }
    );

    loadNotifications();
  } catch (err) {
    console.error(err);
  }
};

const markAllRead = async () => {
  try {
    await fetch(
      "http://localhost:8081/api/notifications/read-all",
      {
        method: "PUT",
        headers: authHeaders,
      }
    );

    loadNotifications();
  } catch (err) {
    console.error(err);
  }
};

  const createUser = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      showToast("User created successfully");
      setShowAddUserModal(false);
      setEditUser(null);
      setNewUser({
        fullName: "",
        email: "",
        password: "",
        role: "USER",
      });
      setShowPassword(false);
      loadUsers();
      loadLogs();
      loadAnalytics();
    } catch (err) {
      showToast("Failed to create user", "error");
    }
  };

  const saveEditUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/admin/users/${editUser.id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            fullName: editUser.fullName,
            email: editUser.email,
            role: editUser.role,
            active: editUser.active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      showToast("User updated successfully");
      setEditUser(null);
      loadUsers();
      loadLogs();
      loadAnalytics();
    } catch (err) {
      showToast("Failed to update user", "error");
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/admin/users/${resetPasswordUser.id}/reset-password?password=${encodeURIComponent(newPassword)}`,
        {
          method: "PUT",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      showToast("Password reset successfully");
      loadAnalytics();
      setResetPasswordUser(null);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      showToast("Password reset failed", "error");
    }
  };

  useEffect(() => {
    if (!token || role !== "ADMIN") return;

    const eventSource = new EventSource("http://localhost:8081/api/telemetry/stream");

    eventSource.addEventListener("telemetry", (e) => {
      try {
        const data = JSON.parse(e.data);
        setCpu(data.cpu);
        setMemory(data.memory);
        setNodes(data.nodes);
        if (data.event) {
          const timestamp = new Date().toLocaleTimeString();
          setTelemetryLogs((prev) => [`[${timestamp}] ${data.event}`, ...prev.slice(0, 7)]);
        }
      } catch (err) {
        console.error("Error parsing telemetry stream:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("Telemetry stream disconnected. Reconnecting...", err);
    };

    return () => {
      eventSource.close();
    };
  }, [token, role]);

  useEffect(() => {
  if (!token) {
    navigate("/");
    return;
  }

  if (role !== "ADMIN") {
    navigate("/");
    return;
  }

  loadUsers();
  loadLogs();
  loadAnalytics();
  loadNotifications();
  const interval = setInterval(() => {
  loadNotifications();
}, 5000);
return () => clearInterval(interval);
}, []);

  async function loadLogs() {
    try {
      const response = await fetch(
        "http://localhost:8081/api/admin/logs",
        {
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalOutputs]);

  const executeShellCommand = async (e) => {
    e.preventDefault();
    if (!terminalCommand.trim()) return;

    const cmd = terminalCommand.trim();
    setTerminalOutputs((prev) => [...prev, `admin@antigravity:~$ ${cmd}`]);
    setTerminalCommand("");
    setTerminalLoading(true);

    if (cmd.toLowerCase() === "/clear") {
      setTerminalOutputs([
        "ANTIGRAVITY CORE SYSTEMS [Version 4.1.0-Secure]",
        "Terminal console cleared. Ready.",
        "",
      ]);
      setTerminalLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/command/execute", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ command: cmd }),
      });

      if (!res.ok) {
        throw new Error("Command execution failed.");
      }

      const data = await res.json();
      setTerminalOutputs((prev) => [...prev, ...data.output.split("\n"), ""]);
    } catch (err) {
      setTerminalOutputs((prev) => [
        ...prev,
        "Error: Could not execute signal link with server core.",
        "",
      ]);
    } finally {
      setTerminalLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      setActionLoading(`status-${id}`);
      const nextStatus = !currentStatus;
      const response = await fetch(
        `http://localhost:8081/api/admin/users/${id}/status?active=${nextStatus}`,
        {
          method: "PUT",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change user status");
      }

      showToast(nextStatus ? "User activated successfully" : "User deactivated successfully");
      loadUsers();
      loadLogs();
      loadAnalytics();
    } catch (err) {
      console.error(err);
      showToast("Failed to modify user status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id) => {
    try {
      setActionLoading(`delete-${id}`);
      const response = await fetch(
        `http://localhost:8081/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      showToast("User deleted successfully");
      setConfirmDelete(null);
      loadUsers();
      loadLogs();
      loadAnalytics();
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const makeAdmin = async (id) => {
    try {
      setActionLoading(`admin-${id}`);
      const response = await fetch(
        `http://localhost:8081/api/admin/users/${id}/role?role=ADMIN`,
        {
          method: "PUT",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      showToast("User promoted to Admin");
      loadUsers();
      loadLogs();
      loadAnalytics();
    } catch (error) {
      console.error(error);
      showToast("Role update failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (activeTab === "admin" && user.role !== "ADMIN") return false;
      if (activeTab === "active" && !user.active) return false;
      if (activeTab === "inactive" && user.active) return false;

      return [user.fullName, user.email, user.role, String(user.id)]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [users, search, activeTab]);

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 flex relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-80 hidden lg:flex flex-col border-r border-white/5 bg-zinc-950/60 p-5 backdrop-blur-3xl relative z-10">
        <div className="mb-12 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white font-mono uppercase">
              ANTIGRAVITY
            </h1>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest font-bold">
              Admin Cockpit
            </p>
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => setActiveSection("users")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition duration-300 font-medium font-mono text-sm cursor-pointer ${
              activeSection === "users"
                ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <Users className="w-5 h-5" />
            User Control Center
          </button>
          <button
            onClick={() => setActiveSection("analytics")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition duration-300 font-medium font-mono text-sm cursor-pointer ${
              activeSection === "analytics"
                ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveSection("logs")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition duration-300 font-medium font-mono text-sm cursor-pointer ${
              activeSection === "logs"
                ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <Shield className="w-5 h-5" />
            Security Center
          </button>
          <button
            onClick={() => setActiveSection("health")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition duration-300 font-medium font-mono text-sm cursor-pointer ${
              activeSection === "health"
                ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <Cpu className="w-5 h-5" />
            System Health
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 w-full transition text-left cursor-pointer font-mono text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 relative z-10 overflow-y-auto">
        
        {/* HEADER PANEL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1.5 font-bold">
              <span>Authorization clearance: level 4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase font-mono">
              {activeSection === "users" && "User Control Center"}
              {activeSection === "analytics" && "Analytics Console"}
              {activeSection === "logs" && "Security Audit Logs"}
              {activeSection === "health" && "System Command Center"}
            </h1>
          </div>

          <div className="flex items-center gap-3">

 {/* NOTIFICATION CENTER */}
<div className="relative">

  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
    className="relative w-12 h-12 rounded-2xl bg-zinc-950/40 border border-white/5 flex items-center justify-center hover:border-cyan-500/30 transition-all"
  >
    <Bell size={20} className="text-white" />

    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
        {unreadCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-4 w-[380px] max-w-[95vw] bg-zinc-950 border border-cyan-500/20 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden z-50">

      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">
          Notifications
        </h3>

        <button
          onClick={markAllRead}
          className="text-cyan-400 text-xs hover:text-cyan-300"
        >
          Mark All Read
        </button>
      </div>

      <div className="max-h-[450px] overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No Notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-white/5 transition-all
              ${
                !notification.isRead
                  ? "bg-cyan-500/5 border-l-4 border-cyan-400"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-semibold text-sm">
                  {notification.title}
                </h4>

                <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {notification.type}
                </span>
              </div>

              <p className="text-zinc-400 text-xs mb-2">
                {notification.message}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-zinc-600 text-[10px]">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </span>

                {!notification.isRead && (
                  <button
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    className="text-cyan-400 text-[11px] hover:text-cyan-300"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  )}
</div>

  <div className="flex items-center gap-3 bg-zinc-950/40 border border-white/5 rounded-2xl px-5 py-3 backdrop-blur-xl">
    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
    <span className="text-zinc-300 text-xs font-mono font-bold">
      UPLINK STATUS: SECURED
    </span>
  </div>

</div>
</div>

        {/* SECTION: USER CONTROL CENTER */}
        {activeSection === "users" && (
          <div className="space-y-8">
            {/* Counts Cards Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-2xl">
                <p className="text-zinc-500 text-xs mb-2 font-mono uppercase tracking-wider">Total Identities</p>
                <h2 className="text-3xl font-black text-white font-mono">{users.length}</h2>
              </div>
              <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-6 backdrop-blur-2xl">
                <p className="text-cyan-400/80 text-xs mb-2 font-mono uppercase tracking-wider">System Admins</p>
                <h2 className="text-3xl font-black text-white font-mono">
                  {users.filter((user) => user.role === "ADMIN").length}
                </h2>
              </div>
              <div className="rounded-3xl border border-green-500/10 bg-green-500/5 p-6 backdrop-blur-2xl">
                <p className="text-emerald-400/80 text-xs mb-2 font-mono uppercase tracking-wider">Active Operators</p>
                <h2 className="text-3xl font-black text-white font-mono">
                  {users.filter((user) => user.active).length}
                </h2>
              </div>
              <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-6 backdrop-blur-2xl">
                <p className="text-red-400/80 text-xs mb-2 font-mono uppercase tracking-wider">Deactivated</p>
                <h2 className="text-3xl font-black text-white font-mono">
                  {users.filter((user) => !user.active).length}
                </h2>
              </div>
            </div>

            {/* Identities Database Table card */}
            <div className="bg-zinc-950/40 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden p-6 lg:p-8">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white mb-1 uppercase font-mono tracking-wider">
                    Database Operators Matrix
                  </h2>
                  <p className="text-zinc-500 text-xs">
                    Authorized command override access keys for local accounts.
                  </p>
                </div>
                <button
                  onClick={loadUsers}
                  className="self-end px-5 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-xs font-medium cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Grid
                </button>
              </div>

              {/* Action Buttons panel */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => {
                    setEditUser(null);
                    setNewUser({
                      fullName: "",
                      email: "",
                      password: "",
                      role: "USER",
                    });
                    setShowAddUserModal(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition duration-300 cursor-pointer"
                >
                  + Add Operator
                </button>
                <button
                  onClick={exportUsers}
                  className="px-4 py-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition duration-300 cursor-pointer text-xs font-semibold"
                >
                  Export Matrix
                </button>
                <button
                  onClick={loadUsers}
                  className="px-4 py-2.5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition duration-300 cursor-pointer text-xs font-semibold"
                >
                  Refresh Cache
                </button>
              </div>

              {/* Filtering tabs & Search bar */}
              <div className="flex flex-col xl:flex-row gap-4 mb-6">
                <div className="flex bg-zinc-900/60 p-1.5 rounded-2xl border border-white/5 self-start">
                  {[
                    { id: "all", label: "All Users" },
                    { id: "admin", label: "Admins" },
                    { id: "active", label: "Active" },
                    { id: "inactive", label: "Inactive" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-zinc-600 absolute left-4.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search index parameters by call moniker, designation email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-zinc-900/40 border border-white/5 text-white outline-none focus:border-cyan-500/40 placeholder-zinc-700 text-xs transition duration-300 font-mono"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto overflow-y-auto max-h-[560px] rounded-2xl border border-white/5 bg-zinc-950/20">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/40 text-zinc-500 text-[10px] font-mono uppercase tracking-wider border-b border-white/5">
                      <th className="p-4 text-left font-medium">INDEX ID</th>
                      <th className="p-4 text-left font-medium">MONIKER NAME</th>
                      <th className="p-4 text-left font-medium">SECURITY EMAIL</th>
                      <th className="p-4 text-left font-medium">CLEARANCE ROLE</th>
                      <th className="p-4 text-left font-medium">STATE STATUS</th>
                      <th className="p-4 text-left font-medium">ACTIONS DIRECTIVE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-zinc-500 font-mono text-xs">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-zinc-700 border-t-cyan-500 mr-2.5 align-middle"></div>
                          Retrieving operator grid cache...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-zinc-500 font-mono text-xs">
                          <AlertCircle className="w-5 h-5 text-zinc-700 inline-block mr-2" />
                          No active credentials matching criteria signal.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-white/5 hover:bg-zinc-900/10 transition-colors duration-200"
                        >
                          <td className="p-4 text-zinc-500 font-mono">#{user.id}</td>
                          <td className="p-4 font-bold text-white text-sm">{user.fullName}</td>
                          <td className="p-4 text-zinc-400 font-mono">{user.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full border text-[9px] font-mono font-bold tracking-wider uppercase ${
                                user.role === "ADMIN"
                                  ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                                  : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleUserStatus(user.id, user.active)}
                              disabled={actionLoading === `status-${user.id}`}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border flex items-center gap-1.5 transition-all duration-300 disabled:opacity-50 cursor-pointer ${
                                user.active
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                  : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                              }`}
                            >
                              {user.active ? (
                                <>
                                  <UserCheck size={12} />
                                  ACTIVE
                                </>
                              ) : (
                                <>
                                  <UserMinus size={12} />
                                  DISABLED
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditUser(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition duration-300 font-semibold cursor-pointer"
                              >
                                <Pencil size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => setResetPasswordUser(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition duration-300 font-semibold cursor-pointer"
                              >
                                Reset
                              </button>
                              <button
                                onClick={() => makeAdmin(user.id)}
                                disabled={user.role === "ADMIN" || actionLoading === `admin-${user.id}`}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 disabled:opacity-20 transition duration-300 font-semibold cursor-pointer"
                              >
                                Promote
                              </button>
                              <button
                                onClick={() => setConfirmDelete(user)}
                                disabled={actionLoading === `delete-${user.id}`}
                                className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-25 transition duration-300 font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ANALYTICS DASHBOARD */}
        {activeSection === "analytics" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6">
                <p className="text-zinc-500 text-xs mb-2 font-mono uppercase tracking-wider">Total Registrations</p>
                <h2 className="text-3xl font-black text-white font-mono">{analytics.totalUsers}</h2>
              </div>
              <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-6">
                <p className="text-cyan-400/80 text-xs mb-2 font-mono uppercase tracking-wider">Online Syncs</p>
                <h2 className="text-3xl font-black text-white font-mono">{analytics.activeUsers}</h2>
              </div>
              <div className="rounded-3xl border border-green-500/10 bg-green-500/5 p-6">
                <p className="text-emerald-400/80 text-xs mb-2 font-mono uppercase tracking-wider">Administrators</p>
                <h2 className="text-3xl font-black text-white font-mono">{analytics.admins}</h2>
              </div>
              <div className="rounded-3xl border border-purple-500/10 bg-purple-500/5 p-6">
                <p className="text-purple-400/80 text-xs mb-2 font-mono uppercase tracking-wider">Total Connections</p>
                <h2 className="text-3xl font-black text-white font-mono">{analytics.totalLogins}</h2>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* AREA GRAPH */}
              <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Database size={16} className="text-cyan-400" />
                  <h3 className="text-white text-base font-bold font-mono uppercase tracking-wider">
                    Operator Volume Growth (Linear)
                  </h3>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.monthlyRegistrations || []}>
                      <defs>
                        <linearGradient id="cyanUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                      <YAxis stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: "#09090b",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          color: "#fff",
                          fontFamily: "monospace"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#cyanUsers)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BAR GRAPH */}
              <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={16} className="text-violet-400" />
                  <h3 className="text-white text-base font-bold font-mono uppercase tracking-wider">
                    Security Transaction Log distribution
                  </h3>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Signins", count: analytics.totalLogins },
                        { name: "PW Resets", count: analytics.totalPasswordResets },
                        { name: "Promotions", count: analytics.totalRoleChanges }
                      ]}
                    >
                      <XAxis dataKey="name" stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                      <YAxis stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: "#09090b",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          color: "#fff",
                          fontFamily: "monospace"
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SECURITY AUDIT LOGS */}
        {activeSection === "logs" && (
          <div className="max-w-[1300px] mx-auto bg-zinc-950/40 border border-white/5 rounded-3xl backdrop-blur-xl p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-white mb-1 uppercase font-mono tracking-wider">Audit Trail Timeline</h2>
                <p className="text-zinc-500 text-xs">Review security parameters and administrative override activities.</p>
              </div>
              <button
                onClick={loadLogs}
                className="px-5 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-xs font-medium cursor-pointer font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Audit
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[560px] rounded-2xl border border-white/5 bg-zinc-950/20">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-900/40 text-zinc-500 text-[10px] font-mono uppercase tracking-wider border-b border-white/5">
                    <th className="p-4 text-left font-medium">TIMESTAMP</th>
                    <th className="p-4 text-left font-medium">EVENT TYPE</th>
                    <th className="p-4 text-left font-medium">ADMIN UPLINK</th>
                    <th className="p-4 text-left font-medium">TARGET CREDENTIALS</th>
                    <th className="p-4 text-left font-medium">TRANSACTION DATA LOG</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-zinc-500 font-mono text-xs">
                        Audit logger registers are empty.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-zinc-900/10 transition-colors duration-200">
                        <td className="p-4 text-zinc-500 font-mono">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-mono font-bold tracking-wider">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-cyan-400 font-mono">{log.adminEmail || "SYSTEM"}</td>
                        <td className="p-4 text-zinc-400 font-mono">{log.targetUser || "—"}</td>
                        <td className="p-4 text-zinc-300 max-w-[380px] truncate" title={log.details}>
                          {log.details || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: SYSTEM HEALTH & SHELL */}
        {activeSection === "health" && (
          <div className="space-y-8">
            {/* Health Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6">
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5"><Cpu size={14} className="text-violet-400" /> CPU Core load</span>
                  <span className="text-white font-bold">{cpu.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-900/60 border border-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                    style={{ width: `${cpu}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6">
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5"><HardDrive size={14} className="text-cyan-400" /> RAM Buffer</span>
                  <span className="text-white font-bold">{memory.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-900/60 border border-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${memory}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6">
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5"><Network size={14} className="text-emerald-400" /> Core Cluster Node Uplinks</span>
                  <span className="text-white font-bold">{nodes} Nodes</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-900/60 border border-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(nodes, 100)}%` }}
                  ></div>
                </div>
              </div>
                      </div>
            {/* Terminal Interface */}
            <div className="bg-black/80 border border-white/5 rounded-3xl p-6 font-mono text-xs shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="text-cyan-400 w-4 h-4 animate-pulse" />
                  <span className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase">SECURE OVERRIDE SHELL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
                </div>
              </div>

              <div className="h-[220px] overflow-y-auto space-y-1.5 mb-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {terminalOutputs.map((line, i) => (
                  <div key={i} className="text-zinc-300 leading-relaxed white-space-pre-wrap">
                    {line}
                  </div>
                ))}
                {terminalLoading && (
                  <div className="text-cyan-400 flex items-center gap-2 font-mono">
                    <span className="w-3.5 h-3.5 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></span>
                    Emitting node directive...
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={executeShellCommand} className="flex gap-3">
                <span className="text-cyan-400 font-bold self-center">admin@antigravity:~$</span>
                <input
                  type="text"
                  value={terminalCommand}
                  onChange={(e) => setTerminalCommand(e.target.value)}
                  placeholder="Enter console commands (e.g. /diagnose, /optimize, /system-logs)..."
                  className="flex-1 bg-transparent text-white outline-none border-none focus:ring-0 focus:outline-none placeholder-zinc-800 font-mono text-xs"
                  disabled={terminalLoading}
                />
              </form>
            </div>

{/* LIVE STREAM LOGGER */}
<div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-white text-sm font-bold font-mono mb-4 uppercase tracking-wider">
                Uplink Telemetry Log Feed
              </h3>
              <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                {telemetryLogs.length === 0 ? (
                  <div className="text-zinc-700 text-xs font-mono">Listening for telemetry streams...</div>
                ) : (
                  telemetryLogs.map((logMsg, idx) => (
                    <div key={idx} className="font-mono text-xs text-zinc-500 flex gap-2">
                      <span className="text-violet-400">»</span>
                      <span>{logMsg}</span>
                    </div>
                  ))
                )}
              </div>
                        </div>
          </div>
        )}
      </main>

      {/* CREATE USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-cyan-500/20 bg-[#05070c] shadow-[0_0_80px_rgba(34,211,238,0.15)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400"></div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                    <UserPlus className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white font-mono uppercase tracking-wider">
                      Create Operator
                    </h2>
                    <p className="text-zinc-500 mt-1 text-xs">
                      Provision a new identity system operator key.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditUser(null);
                  }}
                  className="w-10 h-10 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white flex items-center justify-center text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Commander Mason"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-cyan-500/40 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">Secure Email</label>
                    <input
                      type="email"
                      placeholder="e.g. mason@antigravity.io"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-cyan-500/40 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">Password Key</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full h-12 px-4 pr-12 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-cyan-500/40 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-3">Clearance Level Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setNewUser({ ...newUser, role: "USER" })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        newUser.role === "USER"
                          ? "border-cyan-500/50 bg-cyan-500/10"
                          : "border-white/5 bg-black/40 hover:border-zinc-800"
                      }`}
                    >
                      <div>
                        <span className="text-white text-sm font-bold font-mono block">USER</span>
                        <span className="text-zinc-600 text-[10px] block mt-1">Standard operator node</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${newUser.role === "USER" ? "border-cyan-400 bg-cyan-400/20" : "border-zinc-600"}`}></div>
                    </button>

                    <button
                      onClick={() => setNewUser({ ...newUser, role: "ADMIN" })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        newUser.role === "ADMIN"
                          ? "border-violet-500/50 bg-violet-500/10"
                          : "border-white/5 bg-black/40 hover:border-zinc-800"
                      }`}
                    >
                      <div>
                        <span className="text-white text-sm font-bold font-mono block">ADMIN</span>
                        <span className="text-zinc-600 text-[10px] block mt-1">Full override clearance</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${newUser.role === "ADMIN" ? "border-violet-400 bg-violet-400/20" : "border-zinc-600"}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-white/5">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={createUser}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  Create operator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUser && !showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl rounded-[32px] border border-violet-500/20 bg-[#05070c] shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-violet-500"></div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white font-mono uppercase tracking-wider">Modify Operator Details</h2>
                  <p className="text-zinc-500 text-xs mt-1">Change clearance levels or call moniker data.</p>
                </div>
                <button
                  onClick={() => setEditUser(null)}
                  className="w-10 h-10 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white flex items-center justify-center text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">Moniker Name</label>
                  <input
                    type="text"
                    value={editUser.fullName}
                    onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-violet-500/40 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">Operator Email</label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-violet-500/40 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">Access Role</label>
                    <select
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-violet-500/40 text-xs"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono mb-2">System Status</label>
                    <select
                      value={editUser.active ? "true" : "false"}
                      onChange={(e) => setEditUser({ ...editUser, active: e.target.value === "true" })}
                      className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-violet-500/40 text-xs"
                    >
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-white/5">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-6 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditUser}
                  className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs shadow-md shadow-violet-500/10 cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-[32px] border border-amber-500/20 bg-[#05070c] shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-white font-mono uppercase tracking-wider">Reset Operator Pass</h2>
                  <p className="text-zinc-500 text-xs mt-1">Set new cryptographic key parameters.</p>
                </div>
                <button
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="w-10 h-10 rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white flex items-center justify-center text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="New Password Key"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-amber-500/40 text-xs"
                />
                <input
                  type="password"
                  placeholder="Confirm Password Key"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/5 text-white outline-none focus:border-amber-500/40 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-white/5">
                <button
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="px-6 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={resetPassword}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  Reset pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-zinc-950 border border-white/5 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
              <ShieldAlert size={20} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white font-mono uppercase tracking-wider">Purge Operator Node?</h2>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-mono">
              Are you sure you want to delete user <span className="text-zinc-200 font-bold">{confirmDelete.fullName}</span> from the core database? This action is irreversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 text-xs font-medium hover:bg-zinc-800 transition duration-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDelete.id)}
                className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/35 transition duration-300 cursor-pointer animate-pulse"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl ${
              toast.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/5"
                : "bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/5"
            }`}
          >
            {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
            <span className="text-sm font-semibold tracking-wide font-mono">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Admin;