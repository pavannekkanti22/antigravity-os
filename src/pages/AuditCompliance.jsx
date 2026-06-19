import { useState, useEffect } from "react";
import { Shield, FileText, Download, Search, Filter, AlertTriangle, CheckCircle, X, Clock, User, Globe, Laptop, Activity, FileSpreadsheet, File, Eye, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fallbackLogs = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1, user: ["admin@antigravity.io", "james@example.com", "sarah@example.com", "mike@example.com", "emma@example.com"][i % 5],
  action: ["user.login", "user.logout", "user.password_change", "admin.role_update", "settings.change", "user.create", "user.delete", "admin.system_update", "security.2fa_enabled", "user.failed_login"][i % 10],
  resource: ["/api/auth/login", "/api/users", "/api/admin/settings", "/api/admin/roles", "/api/users/1", "/api/security", "/api/system", "/api/notifications", "/api/threat", "/api/incidents"][i % 10],
  status: ["success", "success", "failure", "success", "success", "success", "failure", "success", "success", "failure"][i % 10],
  ip: ["192.168.1.1", "185.220.101.1", "45.33.32.1", "103.235.46.2", "91.121.87.5", "198.54.117.8", "10.0.0.1", "172.16.0.1"][i % 8],
  location: ["New York, US", "Moscow, RU", "San Francisco, US", "Beijing, CN", "Paris, FR", "Lagos, NG", "Internal", "Internal"][i % 8],
  timestamp: new Date(Date.now() - Math.random() * 604800000 * 4).toISOString(),
}));

const complianceFrameworks = [
  { id: "soc2", name: "SOC 2", status: "compliant", lastAudit: "2026-05-15", score: 94, controls: 145, passed: 136 },
  { id: "gdpr", name: "GDPR", status: "compliant", lastAudit: "2026-06-01", score: 88, controls: 82, passed: 72 },
  { id: "hipaa", name: "HIPAA", status: "in_progress", lastAudit: "2026-04-20", score: 62, controls: 68, passed: 42 },
  { id: "pci_dss", name: "PCI DSS", status: "non_compliant", lastAudit: "2026-03-10", score: 45, controls: 95, passed: 43 },
];

const complianceStatusColors = { compliant: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", in_progress: "text-amber-400 bg-amber-500/10 border-amber-500/20", non_compliant: "text-red-400 bg-red-500/10 border-red-500/20" };

const logActionColors = { user: "text-blue-400 bg-blue-500/10", admin: "text-violet-400 bg-violet-500/10", security: "text-red-400 bg-red-500/10", settings: "text-amber-400 bg-amber-500/10", system: "text-cyan-400 bg-cyan-500/10" };
const logActionBg = { user: "border-blue-500/20", admin: "border-violet-500/20", security: "border-red-500/20", settings: "border-amber-500/20", system: "border-cyan-500/20" };

function getLogCategory(action) {
  if (action.startsWith("user")) return "user";
  if (action.startsWith("admin")) return "admin";
  if (action.startsWith("security")) return "security";
  if (action.startsWith("settings")) return "settings";
  return "system";
}

function formatAction(action) {
  return action.replace(/\./g, " ").replace(/_/g, " ");
}

function AuditCompliance() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => { setLogs(fallbackLogs); }, []);

  const filtered = logs.filter(log => {
    if (categoryFilter !== "all" && getLogCategory(log.action) !== categoryFilter) return false;
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    if (search && !log.user.toLowerCase().includes(search.toLowerCase()) && !formatAction(log.action).toLowerCase().includes(search.toLowerCase()) && !log.resource.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedLogs = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = () => {
    const headers = "ID,User,Action,Resource,Status,IP,Location,Timestamp\n";
    const rows = logs.map(l => `${l.id},"${l.user}","${formatAction(l.action)}","${l.resource}",${l.status},"${l.ip}","${l.location}","${new Date(l.timestamp).toISOString()}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const actionStats = ["user", "admin", "security", "settings", "system"].map(cat => ({
    category: cat, count: logs.filter(l => getLogCategory(l.action) === cat).length,
  }));
  const successRate = logs.length ? Math.round((logs.filter(l => l.status === "success").length / logs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Audit & Compliance</h1>
          <p className="text-zinc-500 text-sm mt-0.5">System audit logs, compliance monitoring, and exportable reports</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium text-sm transition cursor-pointer">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: logs.length, icon: Activity, color: "text-white", border: "border-zinc-800" },
          { label: "Success Rate", value: `${successRate}%`, icon: CheckCircle, color: "text-emerald-400", border: "border-emerald-500/20" },
          { label: "Failed Events", value: logs.filter(l => l.status === "failure").length, icon: AlertTriangle, color: "text-red-400", border: "border-red-500/20" },
          { label: "Security Events", value: logs.filter(l => getLogCategory(l.action) === "security").length, icon: Shield, color: "text-amber-400", border: "border-amber-500/20" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl bg-zinc-900/60 border ${card.border} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-xs font-medium">{card.label}</span>
                <Icon size={16} className={card.color} />
              </div>
              <div className={`text-2xl font-semibold ${card.color}`}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Compliance Frameworks */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {complianceFrameworks.map(fw => {
          const compColor = complianceStatusColors[fw.status] || complianceStatusColors.non_compliant;
          const pct = Math.round((fw.passed / fw.controls) * 100);
          return (
            <div key={fw.id} className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-sm">{fw.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${compColor}`}>{fw.status.replace("_", " ")}</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-500">Score</span>
                <span className="text-white font-medium">{fw.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all ${
                  fw.status === "compliant" ? "bg-emerald-500" : fw.status === "in_progress" ? "bg-amber-500" : "bg-red-500"
                }`} style={{ width: `${fw.score}%` }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>{fw.passed}/{fw.controls} controls</span>
                <span>{fw.lastAudit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-white font-medium flex items-center gap-2"><FileText size={16} className="text-zinc-400" /> Audit Logs</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input type="text" placeholder="Search logs..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-48 pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-xs outline-none focus:border-zinc-700 placeholder-zinc-600" />
              </div>
              <div className="flex gap-1.5">
                {["all", "user", "admin", "security", "settings", "system"].map(c => (
                  <button key={c} onClick={() => { setCategoryFilter(c); setPage(1); }}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition cursor-pointer capitalize ${categoryFilter === c ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/30 max-h-[600px] overflow-y-auto">
            {paginatedLogs.map((log) => {
              const cat = getLogCategory(log.action);
              const catColor = logActionColors[cat] || logActionColors.system;
              return (
                <div key={log.id} className="p-4 hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${catColor} flex items-center justify-center shrink-0`}>
                      {cat === "admin" ? <Shield size={15} /> : cat === "security" ? <AlertTriangle size={15} /> : <Info size={15} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white text-sm font-medium capitalize">{formatAction(log.action)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${log.status === "success" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>{log.status}</span>
                      </div>
                      <p className="text-zinc-500 text-xs mt-0.5 font-mono">{log.resource}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-zinc-500 text-[10px]">
                        <span className="flex items-center gap-1"><User size={10} /> {log.user}</span>
                        <span className="flex items-center gap-1"><Globe size={10} /> {log.ip}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} /> {log.location}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-zinc-800/30 flex items-center justify-between">
              <span className="text-zinc-500 text-xs">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 text-xs disabled:opacity-30 hover:bg-zinc-800/60 transition cursor-pointer">Prev</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 text-xs disabled:opacity-30 hover:bg-zinc-800/60 transition cursor-pointer">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Activity size={16} className="text-zinc-400" /> Event Distribution</h3>
            <div className="space-y-3">
              {actionStats.map(({ category, count }) => {
                const maxCount = Math.max(...actionStats.map(a => a.count), 1);
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-400 capitalize">{category}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><FileSpreadsheet size={16} className="text-zinc-400" /> Reports</h3>
            <div className="space-y-2">
              {[
                { label: "Full Audit Log Export", icon: FileText, desc: "All system events as CSV", format: ".csv" },
                { label: "Compliance Summary", icon: Shield, desc: "Framework status report", format: ".pdf" },
                { label: "Security Events", icon: AlertTriangle, desc: "Filtered security audit", format: ".csv" },
                { label: "User Activity Report", icon: User, desc: "Per-user action summary", format: ".csv" },
              ].map((rpt, i) => {
                const Icon = rpt.icon;
                return (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-zinc-800/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <Icon size={14} className="text-zinc-500" />
                      <div>
                        <p className="text-zinc-300 text-xs font-medium">{rpt.label}</p>
                        <p className="text-zinc-600 text-[10px]">{rpt.desc}</p>
                      </div>
                    </div>
                    <button onClick={exportCSV} className="px-2.5 py-1 rounded bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] cursor-pointer">{rpt.format}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default AuditCompliance;