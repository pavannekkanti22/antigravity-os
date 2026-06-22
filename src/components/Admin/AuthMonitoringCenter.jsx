import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  ShieldAlert,
  Activity,
  LogIn,
  LogOut,
  AlertTriangle,
  RefreshCw,
  Search,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  Filter,
  ChevronDown,
  Eye,
} from "lucide-react";
import { BASE_URL } from "../../services/api";

const token = () => localStorage.getItem("token");

const headers = () => ({
  Authorization: `Bearer ${token()}`,
  "Content-Type": "application/json",
});

const actionConfig = {
  LOGIN_SUCCESS: { label: "Login", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: LogIn },
  LOGIN_FAILED: { label: "Failed Login", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: ShieldAlert },
  LOGOUT: { label: "Logout", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20", icon: LogOut },
};

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return "—";
  if (seconds < 60) return seconds + "s";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m " + (seconds % 60) + "s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h + "h " + m + "m";
}

function AuthMonitoringCenter() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterSuspicious, setFilterSuspicious] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        fetch(BASE_URL + "/api/admin/auth-monitoring", { headers: headers() }),
        fetch(BASE_URL + "/api/admin/auth-monitoring/stats", { headers: headers() }),
      ]);
      if (logsRes.ok) setLogs(await logsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error("Failed to load auth monitoring data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = logs.filter((log) => {
    if (search && !log.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAction !== "all" && log.action !== filterAction) return false;
    if (filterSuspicious && !log.suspicious) return false;
    return true;
  });

  const statCards = [
    { label: "Total Logins", value: stats?.totalLogins ?? "—", icon: LogIn, color: "text-emerald-400", border: "border-emerald-500/10" },
    { label: "Failed Attempts", value: stats?.failedLogins ?? "—", icon: ShieldAlert, color: "text-red-400", border: "border-red-500/10" },
    { label: "Active Users (24h)", value: stats?.activeUsers ?? "—", icon: Activity, color: "text-cyan-400", border: "border-cyan-500/10" },
    { label: "Suspicious Events", value: stats?.suspiciousEvents ?? "—", icon: AlertTriangle, color: "text-amber-400", border: "border-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-cyan-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">Security Operations</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase font-mono tracking-wider">Authentication Monitoring Center</h1>
          <p className="text-zinc-500 text-xs mt-1">Real-time visibility into identity access & authentication events</p>
        </div>
        <button onClick={loadData} className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-xs font-medium cursor-pointer font-mono">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className={`rounded-2xl border ${card.border} bg-[#0a0a0f]/60 p-5`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">{card.label}</p>
              <card.icon size={16} className={card.color} />
            </div>
            <h2 className={`text-2xl font-bold ${card.color} font-mono`}>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* 24h Activity Mini Summary */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex items-center gap-3">
            <LogIn size={14} className="text-emerald-400" />
            <div>
              <p className="text-zinc-500 text-[10px] font-mono uppercase">Logins (24h)</p>
              <p className="text-white text-sm font-bold font-mono">{stats.logins24h || 0}</p>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex items-center gap-3">
            <ShieldAlert size={14} className="text-red-400" />
            <div>
              <p className="text-zinc-500 text-[10px] font-mono uppercase">Failed (24h)</p>
              <p className="text-white text-sm font-bold font-mono">{stats.failed24h || 0}</p>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex items-center gap-3">
            <LogOut size={14} className="text-zinc-400" />
            <div>
              <p className="text-zinc-500 text-[10px] font-mono uppercase">Logouts</p>
              <p className="text-white text-sm font-bold font-mono">{stats.logouts || 0}</p>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex items-center gap-3">
            <AlertTriangle size={14} className="text-amber-400" />
            <div>
              <p className="text-zinc-500 text-[10px] font-mono uppercase">Suspicious</p>
              <p className="text-white text-sm font-bold font-mono">{stats.suspiciousEvents || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 transition-all font-mono"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-black/50 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Events</option>
              <option value="LOGIN_SUCCESS">Logins</option>
              <option value="LOGIN_FAILED">Failed</option>
              <option value="LOGOUT">Logouts</option>
            </select>
          </div>
          <button
            onClick={() => setFilterSuspicious(!filterSuspicious)}
            className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
              filterSuspicious
                ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-300"
            }`}
          >
            <AlertTriangle size={12} />
            {filterSuspicious ? "Suspicious Only" : "All Events"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-900/40 text-zinc-500 text-[10px] font-mono uppercase tracking-wider border-b border-white/5 sticky top-0">
                <th className="p-4 text-left font-medium">User</th>
                <th className="p-4 text-left font-medium">Event</th>
                <th className="p-4 text-left font-medium">Timestamp</th>
                <th className="p-4 text-left font-medium">Duration</th>
                <th className="p-4 text-left font-medium">Device</th>
                <th className="p-4 text-left font-medium">Location</th>
                <th className="p-4 text-left font-medium">Risk</th>
                <th className="p-4 text-left font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-zinc-500 font-mono text-xs">Loading auth telemetry...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-zinc-500 font-mono text-xs">
                    {search || filterAction !== "all" || filterSuspicious
                      ? "No events match the current filters."
                      : "No authentication events recorded yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const cfg = actionConfig[log.action] || { label: log.action, color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20", icon: Eye };
                  const Icon = cfg.icon;
                  return (
                    <tr key={log.id} className={`border-b border-white/5 hover:bg-zinc-900/10 transition-colors duration-200 ${log.suspicious ? "bg-amber-500/5" : ""}`}>
                      <td className="p-4">
                        <span className="text-cyan-400 font-mono text-xs font-medium">{log.email}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.color} text-[9px] font-mono font-bold tracking-wider`}>
                          <Icon size={10} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400 font-mono text-[11px]">
                        {log.sessionDuration != null ? formatDuration(log.sessionDuration) : "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {log.deviceType === "Mobile" ? (
                            <Smartphone size={12} className="text-zinc-500" />
                          ) : log.deviceType === "API" ? (
                            <Globe size={12} className="text-zinc-500" />
                          ) : (
                            <Monitor size={12} className="text-zinc-500" />
                          )}
                          <span className="text-zinc-400 font-mono text-[11px]">{log.deviceType || "Unknown"}</span>
                        </div>
                        {log.userAgent && (
                          <div className="text-zinc-600 text-[9px] font-mono truncate max-w-[150px]" title={log.userAgent}>
                            {log.userAgent.split("/")[0] || log.userAgent.substring(0, 40)}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400 font-mono text-[11px]">{log.location || "—"}</td>
                      <td className="p-4">
                        {log.suspicious ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle size={12} className="text-amber-400" />
                            <span className="text-amber-400 text-[10px] font-mono font-bold">Suspicious</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Shield size={12} className="text-emerald-500" />
                            <span className="text-emerald-500 text-[10px] font-mono">Legitimate</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-zinc-500 font-mono text-[10px] max-w-[180px] truncate" title={log.riskReason || ""}>
                        {log.riskReason || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuthMonitoringCenter;
