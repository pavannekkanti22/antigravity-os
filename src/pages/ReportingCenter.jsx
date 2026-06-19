import { useState, useEffect } from "react";
import { BarChart3, FileText, Download, Calendar, Clock, User, Shield, AlertTriangle, CheckCircle, Activity, RefreshCw, Plus, X, Filter, FileSpreadsheet, File as FileIcon, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const templates = [
  { id: "security_audit", name: "Security Audit Report", icon: Shield, desc: "Failed logins, threat events, brute force attempts, suspicious IPs", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { id: "user_activity", name: "User Activity Report", icon: User, desc: "Logins, registrations, profile changes, session data", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "threat_summary", name: "Threat Summary", icon: AlertTriangle, desc: "Threat distribution, risk scores, blocked attacks, top threat vectors", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { id: "compliance", name: "Compliance Report", icon: CheckCircle, desc: "SOC 2, GDPR, HIPAA, PCI DSS scores and control status", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "system_health", name: "System Health Report", icon: Activity, desc: "Uptime, service status, latency metrics, resource usage", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { id: "full_audit", name: "Full Audit Log Export", icon: FileText, desc: "Complete system audit log with all events and filters", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
];

const fallbackHistory = [
  { id: 1, template: "security_audit", date: "2026-06-17", format: "csv", status: "completed", rows: 284, generatedBy: "admin@antigravity.io" },
  { id: 2, template: "user_activity", date: "2026-06-16", format: "pdf", status: "completed", rows: 156, generatedBy: "admin@antigravity.io" },
  { id: 3, template: "compliance", date: "2026-06-15", format: "csv", status: "completed", rows: 42, generatedBy: "admin@antigravity.io" },
  { id: 4, template: "threat_summary", date: "2026-06-14", format: "csv", status: "failed", rows: 0, generatedBy: "admin@antigravity.io" },
  { id: 5, template: "system_health", date: "2026-06-13", format: "pdf", status: "completed", rows: 89, generatedBy: "admin@antigravity.io" },
];

const fallbackSchedules = [
  { id: 1, template: "security_audit", frequency: "daily", nextRun: "2026-06-19", recipients: "admin@antigravity.io, security@antigravity.io", active: true },
  { id: 2, template: "compliance", frequency: "weekly", nextRun: "2026-06-22", recipients: "admin@antigravity.io", active: true },
  { id: 3, template: "system_health", frequency: "daily", nextRun: "2026-06-19", recipients: "ops@antigravity.io", active: false },
];

const templateLabels = { security_audit: "Security Audit", user_activity: "User Activity", threat_summary: "Threat Summary", compliance: "Compliance", system_health: "System Health", full_audit: "Full Audit Log" };

function downloadCSV(template) {
  const headers = "ID,Timestamp,Event,User,Status\n";
  const mockRows = Array.from({ length: 50 }, (_, i) => `${i + 1},${new Date(Date.now() - i * 3600000).toISOString()},${["login","logout","threat","compliance_check"][i % 4]},user@example.com,${i % 3 === 0 ? "failure" : "success"}`).join("\n");
  const blob = new Blob([headers + mockRows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${template}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function ReportingCenter() {
  const [history, setHistory] = useState(fallbackHistory);
  const [schedules, setSchedules] = useState(fallbackSchedules);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [format, setFormat] = useState("csv");
  const [toast, setToast] = useState(null);
  const [filterFormat, setFilterFormat] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const generateReport = () => {
    if (!selectedTemplate) return;
    const newReport = { id: Date.now(), template: selectedTemplate.id, date: new Date().toISOString().split("T")[0], format, status: "completed", rows: Math.floor(Math.random() * 500) + 20, generatedBy: "admin@antigravity.io" };
    setHistory(prev => [newReport, ...prev]);
    downloadCSV(selectedTemplate.id);
    setShowGenerate(false);
    setSelectedTemplate(null);
    showToast(`${selectedTemplate.name} generated as ${format.toUpperCase()}`);
  };

  const toggleSchedule = (id) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast("Schedule updated");
  };

  const filteredHistory = filterFormat === "all" ? history : history.filter(h => h.format === filterFormat);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reporting Center</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Generate, schedule, and export system reports</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available Templates", value: templates.length, icon: FileText, color: "text-white", border: "border-zinc-800" },
          { label: "Reports Generated", value: history.length, icon: BarChart3, color: "text-cyan-400", border: "border-cyan-500/20" },
          { label: "Scheduled Reports", value: schedules.filter(s => s.active).length, icon: Calendar, color: "text-amber-400", border: "border-amber-500/20" },
          { label: "CSV Available", value: history.filter(h => h.format === "csv").length, icon: Download, color: "text-emerald-400", border: "border-emerald-500/20" },
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

      {/* Report Templates */}
      <div>
        <h3 className="text-white font-medium mb-4 flex items-center gap-2"><FileText size={16} className="text-zinc-400" /> Report Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => {
            const Icon = t.icon;
            const isSelected = selectedTemplate?.id === t.id;
            return (
              <div key={t.id} onClick={() => { setSelectedTemplate(t); setShowGenerate(true); }}
                className={`rounded-xl border p-5 transition-all cursor-pointer ${isSelected ? "border-cyan-500/40 bg-zinc-800/40" : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"}`}>
                <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <h4 className="text-white font-medium text-sm mb-1">{t.name}</h4>
                <p className="text-zinc-500 text-xs">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report History */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-white font-medium flex items-center gap-2"><Clock size={16} className="text-zinc-400" /> Report History</h3>
            <div className="flex gap-1.5">
              {["all", "csv", "pdf"].map(f => (
                <button key={f} onClick={() => setFilterFormat(f)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition cursor-pointer uppercase ${filterFormat === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-zinc-800/30">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No reports generated yet</div>
            ) : (
              filteredHistory.map(r => {
                const t = templates.find(t => t.id === r.template);
                const Icon = t?.icon || FileText;
                const tColor = t?.color || "text-zinc-400 bg-zinc-800/40";
                return (
                  <div key={r.id} className="p-4 hover:bg-zinc-800/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg ${tColor} flex items-center justify-center shrink-0`}><Icon size={15} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white text-sm font-medium">{templateLabels[r.template] || r.template}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${r.status === "completed" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>{r.status}</span>
                            <span className="text-zinc-500 text-[10px] uppercase font-mono">{r.format}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-zinc-500 text-[10px]">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {r.date}</span>
                          <span className="flex items-center gap-1"><FileText size={10} /> {r.rows} rows</span>
                          <span className="flex items-center gap-1"><User size={10} /> {r.generatedBy}</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); downloadCSV(r.template); }} className="p-2 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer">
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="space-y-6">
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2"><Calendar size={16} className="text-zinc-400" /> Scheduled</h3>
              <button onClick={() => setShowSchedule(true)} className="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"><Plus size={14} /></button>
            </div>
            <div className="space-y-3">
              {schedules.map(s => {
                const t = templates.find(t => t.id === s.template);
                const Icon = t?.icon || Calendar;
                return (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-800/20 border border-zinc-800/50">
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className="text-zinc-500" />
                      <div>
                        <p className="text-zinc-300 text-xs font-medium capitalize">{templateLabels[s.template]}</p>
                        <p className="text-zinc-600 text-[10px]">{s.frequency} · Next: {s.nextRun}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleSchedule(s.id)} className={`w-9 h-5 rounded-full transition cursor-pointer relative ${s.active ? "bg-emerald-500" : "bg-zinc-700"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.active ? "left-4" : "left-0.5"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><FileSpreadsheet size={16} className="text-zinc-400" /> Quick Export</h3>
            <div className="space-y-2">
              {[
                { label: "Full Audit Log", template: "full_audit" },
                { label: "Security Events", template: "security_audit" },
                { label: "User Activity", template: "user_activity" },
                { label: "Compliance Status", template: "compliance" },
              ].map((item, i) => (
                <button key={i} onClick={() => { downloadCSV(item.template); showToast(`${item.label} CSV downloaded`); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/20 transition cursor-pointer">
                  <span className="text-zinc-300 text-xs">{item.label}</span>
                  <FileIcon size={13} className="text-zinc-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerate && selectedTemplate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${selectedTemplate.color} flex items-center justify-center`}>
                      <selectedTemplate.icon size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Generate Report</h2>
                      <p className="text-zinc-500 text-xs mt-0.5">{selectedTemplate.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowGenerate(false)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Date Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-zinc-600 text-[10px] block mb-1">From</span>
                        <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
                      </div>
                      <div>
                        <span className="text-zinc-600 text-[10px] block mb-1">To</span>
                        <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Export Format</label>
                    <div className="flex gap-2">
                      {["csv", "pdf", "excel"].map(f => (
                        <button key={f} onClick={() => setFormat(f)}
                          className={`flex-1 h-11 rounded-lg border text-sm font-medium transition cursor-pointer uppercase ${
                            format === f ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-500 text-xs">{selectedTemplate.desc}</p>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                  <button onClick={() => setShowGenerate(false)} className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-sm transition cursor-pointer">Cancel</button>
                  <button onClick={generateReport} className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium text-sm transition cursor-pointer">Generate & Download</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showSchedule && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Schedule Report</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Set up automated report generation</p>
                  </div>
                  <button onClick={() => setShowSchedule(false)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Report Template</label>
                    <select className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
                      {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Frequency</label>
                    <select className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Recipients (comma separated)</label>
                    <input type="text" placeholder="admin@antigravity.io, team@antigravity.io"
                      className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                  <button onClick={() => setShowSchedule(false)} className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-sm transition cursor-pointer">Cancel</button>
                  <button onClick={() => { setShowSchedule(false); showToast("Report scheduled"); }} className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium text-sm transition cursor-pointer">Schedule</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-5 py-3 rounded-xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl ${
              toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
            {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReportingCenter;