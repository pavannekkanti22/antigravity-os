import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Activity
} from "lucide-react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'admin', 'active', 'inactive'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Live Telemetry states
  const [cpu, setCpu] = useState(45);
  const [memory, setMemory] = useState(58);
  const [nodes, setNodes] = useState(94);
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  // Terminal Console states
  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalOutputs, setTerminalOutputs] = useState([
    "ANTIGRAVITY CORE SYSTEMS [Version 4.1.0-Secure]",
    "(c) 2026 Antigravity Technologies. All rights reserved.",
    "",
    "Ready for telemetry uplink. Type /help to view command nodes.",
    ""
  ]);
  const [terminalLoading, setTerminalLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const terminalEndRef = useRef(null);

  // Auth Headers
  const authHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const loadUsers = async () => {
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
  };

  // SSE Telemetry Stream
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
          setTelemetryLogs((prev) => [
            `[${timestamp}] ${data.event}`,
            ...prev.slice(0, 7)
          ]);
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

  // Initial Load & Auth check
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
  }, []);

  // Autoscroll Terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalOutputs]);

  // Execute terminal shell command
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
        ""
      ]);
      setTerminalLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/command/execute", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ command: cmd })
      });
      
      if (!res.ok) {
        throw new Error("Command execution node failed.");
      }

      const data = await res.json();
      setTerminalOutputs((prev) => [
        ...prev,
        ...data.output.split("\n"),
        ""
      ]);
    } catch (err) {
      setTerminalOutputs((prev) => [
        ...prev,
        "Error: Could not execute signal link with server core.",
        ""
      ]);
    } finally {
      setTerminalLoading(false);
    }
  };

  // Toggle user active status
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
    } catch (error) {
      console.error(error);
      showToast("Role update failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Tab Filters
      if (activeTab === "admin" && user.role !== "ADMIN") return false;
      if (activeTab === "active" && !user.active) return false;
      if (activeTab === "inactive" && user.active) return false;

      // Text Search
      return [user.fullName, user.email, user.role, String(user.id)]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [users, search, activeTab]);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* SIDEBAR */}
      <aside className="w-80 hidden lg:flex flex-col border-r border-zinc-900 bg-zinc-950/60 p-8 backdrop-blur-md relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">
                ANTIGRAVITY
              </h1>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-medium cursor-pointer transition duration-300">
            <Users className="w-5 h-5" />
            User Control Center
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-900/40 border-l-2 border-transparent transition duration-300 cursor-not-allowed">
            <Activity className="w-5 h-5" />
            System Operations
          </div>
        </nav>

        <div className="pt-6 border-t border-zinc-900">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="w-full py-4 rounded-2xl bg-red-500/5 border border-red-500/15 text-red-400 hover:bg-red-500/15 transition-all duration-300 flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            De-authenticate
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 lg:p-10 relative z-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1.5">
              <span>Security Clearance: LEVEL 4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">
              System Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl px-5 py-3.5 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-300 text-sm font-medium">Uplink: Synchronized</span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* CPU Load */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                CPU Core Load
              </h3>
              <span className="text-zinc-500 text-[10px] font-mono">SYS_CORE</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-extrabold text-white tracking-tight">{cpu}%</span>
                <p className="text-zinc-500 text-[10px] mt-1 font-mono uppercase tracking-wider">Holographic Processor</p>
              </div>
              <div className="w-24 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cpu}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Memory Heap */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-violet-400" />
                Memory allocation
              </h3>
              <span className="text-zinc-500 text-[10px] font-mono">SYS_HEAP</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-extrabold text-white tracking-tight">{memory}%</span>
                <p className="text-zinc-500 text-[10px] mt-1 font-mono uppercase tracking-wider">Volatile Indexing</p>
              </div>
              <div className="w-24 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="bg-gradient-to-r from-violet-400 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${memory}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Cluster Nodes */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <Network className="w-4 h-4 text-emerald-400" />
                Cluster Nodes
              </h3>
              <span className="text-zinc-500 text-[10px] font-mono">NET_MATRIX</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-extrabold text-white tracking-tight">{nodes}</span>
                <p className="text-zinc-500 text-[10px] mt-1 font-mono uppercase tracking-wider">Cognitive Links Online</p>
              </div>
              <div className="w-24 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(nodes/110)*100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* TELEMETRY EVENT TICKER */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl px-5 py-3 mb-8 backdrop-blur-sm flex items-center gap-3">
          <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase tracking-widest">
            UPLINK LOG
          </span>
          <div className="flex-1 text-[11px] font-mono text-zinc-400 overflow-hidden h-4 relative">
            <div className="absolute inset-0 flex items-center">
              {telemetryLogs.length > 0 ? (
                <span className="text-zinc-300 animate-pulse">{telemetryLogs[0]}</span>
              ) : (
                <span className="text-zinc-600">Awaiting stream packets...</span>
              )}
            </div>
          </div>
        </div>

        {/* LIVE TERMINAL CONSOLE */}
        <div className="bg-[#09090c] border border-zinc-900 rounded-3xl p-6 mb-10 font-mono text-xs text-cyan-400 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5 mb-4">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/60"></span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-widest font-mono">
              <TerminalIcon className="w-3.5 h-3.5 text-zinc-600" />
              antigravity_core_shell
            </div>
          </div>
          
          <div className="h-44 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
            {terminalOutputs.map((line, idx) => (
              <div 
                key={idx} 
                className={
                  line.startsWith("admin@antigravity") 
                    ? "text-cyan-400 font-bold" 
                    : line.startsWith("Error:") 
                      ? "text-red-400" 
                      : line.startsWith("AVAILABLE COMMANDS") || line.startsWith("SYS-LOGS") || line.startsWith("SYSTEM SECURED") || line.startsWith("DIAGNOSTIC STATUS")
                        ? "text-purple-400 font-semibold"
                        : "text-zinc-300"
                }
              >
                {line}
              </div>
            ))}
            {terminalLoading && (
              <div className="text-zinc-500 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Processing remote heuristics query...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={executeShellCommand} className="mt-4 flex items-center border-t border-zinc-900 pt-3.5">
            <span className="text-cyan-400 mr-2.5 font-bold">admin@antigravity:~$</span>
            <input
              type="text"
              value={terminalCommand}
              onChange={(e) => setTerminalCommand(e.target.value)}
              disabled={terminalLoading}
              placeholder="Type system directive... (e.g. /help, /diagnose, /optimize, /system-logs)"
              className="flex-1 bg-transparent text-white outline-none border-none focus:ring-0 placeholder-zinc-700 text-xs"
            />
          </form>
        </div>

        {/* USER CONTROLS PANEL */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl backdrop-blur-xl overflow-hidden p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Database Commander Control
              </h2>
              <p className="text-zinc-500 text-sm">
                Authorized command options for localized user identities.
              </p>
            </div>
            
            <button
              onClick={loadUsers}
              className="self-end px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Grid
            </button>
          </div>

          {/* SEARCH & TABS FILTER BAR */}
          <div className="flex flex-col xl:flex-row gap-4 mb-6">
            {/* Filter Tabs */}
            <div className="flex bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800/80 self-start">
              {[
                { id: "all", label: "All Users" },
                { id: "admin", label: "Admins" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shadow-md"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-zinc-600 absolute left-4.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search index by designation, identifier, or email matrix..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-white outline-none focus:border-cyan-500/40 placeholder-zinc-600 text-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/20">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr className="bg-zinc-900/40 text-zinc-500 text-xs font-mono uppercase tracking-wider border-b border-zinc-900">
                  <th className="p-5 text-left font-medium">DESIGNATION ID</th>
                  <th className="p-5 text-left font-medium">FULL NAME</th>
                  <th className="p-5 text-left font-medium">SECURE EMAIL</th>
                  <th className="p-5 text-left font-medium">AUTH ROLE</th>
                  <th className="p-5 text-left font-medium">SYSTEM STATUS</th>
                  <th className="p-5 text-left font-medium">HEURISTIC DIRECTIVES</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-zinc-600 font-mono text-xs">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-zinc-700 border-t-cyan-500 mr-2.5 align-middle"></div>
                      Indexing identity cache...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-zinc-500 font-mono text-xs">
                      <AlertCircle className="w-5 h-5 text-zinc-600 inline-block mr-2" />
                      No identity signals matching query constraints.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-900 hover:bg-zinc-900/10 transition-colors duration-200"
                    >
                      <td className="p-5 text-zinc-500 font-mono text-xs">#{user.id}</td>
                      <td className="p-5 font-semibold text-white">{user.fullName}</td>
                      <td className="p-5 text-zinc-400 font-mono text-sm">{user.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                            : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.active)}
                          disabled={actionLoading === `status-${user.id}`}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all duration-300 disabled:opacity-50 cursor-pointer ${
                            user.active
                              ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                              : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          {user.active ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserMinus className="w-3.5 h-3.5" />
                              Deactivated
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => makeAdmin(user.id)}
                            disabled={
                              user.role === "ADMIN" ||
                              actionLoading === `admin-${user.id}`
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-20 transition-all duration-300 text-xs font-semibold cursor-pointer"
                          >
                            Promote
                          </button>

                          <button
                            onClick={() => setConfirmDelete(user)}
                            disabled={actionLoading === `delete-${user.id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 disabled:opacity-25 transition-all duration-300 text-xs font-semibold cursor-pointer"
                          >
                            Purge
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
      </main>

      {/* TOAST SYSTEM */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl transition-all duration-500 ${
            toast.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/5"
              : "bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/5"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* PURGE CONFIRMATION MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 shadow-2xl shadow-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">Purge Identity?</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Are you sure you want to purge user <span className="text-zinc-200 font-semibold">{confirmDelete.fullName}</span> from the core database? This action is irreversible.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition duration-300"
              >
                Abort
              </button>

              <button
                onClick={() => deleteUser(confirmDelete.id)}
                className="px-5 py-3 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/25 transition duration-300"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;