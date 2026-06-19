import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock, User, Plus, X, Activity, Ban, Lock, LogOut, RefreshCw, Flag } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";

const fallbackIncidents = [
  { id: 1, title: "Brute Force Attack on Admin Account", severity: "critical", status: "open", assignedTo: "Security Team", createdAt: Date.now() - 3600000, description: "Multiple failed login attempts from IP 91.121.87.5" },
  { id: 2, title: "Suspicious Login from Unknown Location", severity: "high", status: "investigating", assignedTo: "John", createdAt: Date.now() - 86400000, description: "User james@example.com logged in from Beijing, CN" },
  { id: 3, title: "Impossible Travel Detected", severity: "critical", status: "resolved", assignedTo: "Sarah", createdAt: Date.now() - 172800000, description: "User logged in from SF and NY within 2 minutes" },
  { id: 4, title: "New Device Recognition Alert", severity: "medium", status: "open", assignedTo: null, createdAt: Date.now() - 259200000, description: "Unrecognized device logged into production system" },
  { id: 5, title: "API Key Leak Detected", severity: "high", status: "open", assignedTo: null, createdAt: Date.now() - 432000000, description: "API key found in public GitHub repository" },
];

const responseActions = [
  { id: "block", label: "Block User", icon: Ban, color: "#EF4444" },
  { id: "logout", label: "Force Logout", icon: LogOut, color: "#F59E0B" },
  { id: "lock", label: "Lock Account", icon: Lock, color: "#F59E0B" },
  { id: "reset", label: "Reset Password", icon: RefreshCw, color: "#3B82F6" },
  { id: "escalate", label: "Escalate", icon: Flag, color: "#7C3AED" },
];

function IncidentResponse() {
  const [incidents, setIncidents] = useState(fallbackIncidents);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", severity: "medium", assignedTo: "" });
  const addToast = useToast();

  const stats = {
    open: incidents.filter(i => i.status === "open").length,
    investigating: incidents.filter(i => i.status === "investigating").length,
    resolved: incidents.filter(i => i.status === "resolved").length,
    critical: incidents.filter(i => i.severity === "critical").length,
  };

  const createIncident = () => {
    if (!form.title.trim()) return;
    const newIncident = { id: Date.now(), ...form, status: "open", createdAt: Date.now() };
    setIncidents(prev => [newIncident, ...prev]);
    setShowCreate(false);
    setForm({ title: "", description: "", severity: "medium", assignedTo: "" });
    addToast("Incident created", "success");
  };

  const updateStatus = (id, status) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    addToast(`Incident ${status}`, status === "resolved" ? "success" : "info");
  };

  const executeAction = (incidentId, actionId) => {
    addToast(`Action "${actionId}" executed on incident #${incidentId}`, "info");
  };

  const severityBadge = (sev) => {
    const variants = { critical: "red", high: "amber", medium: "blue", low: "gray" };
    return <StatusBadge variant={variants[sev]}>{sev}</StatusBadge>;
  };
  const statusBadge = (st) => {
    const variants = { open: "red", investigating: "amber", resolved: "green", closed: "gray" };
    return <StatusBadge variant={variants[st]} dot>{st}</StatusBadge>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", margin: 0 }}>Incident Response</h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>Manage and coordinate security incident response</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> New Incident</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard icon={AlertTriangle} label="Open" value={stats.open} color="red" />
        <StatCard icon={Activity} label="Investigating" value={stats.investigating} color="amber" />
        <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="green" />
        <StatCard icon={Shield} label="Critical" value={stats.critical} color="red" />
      </div>

      {/* Incident List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {incidents.map(incident => (
          <div key={incident.id} className="surface-elevated" style={{ padding: "16px 20px", cursor: "pointer" }} onClick={() => setSelectedIncident(incident)}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: incident.severity === "critical" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${incident.severity === "critical" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AlertTriangle size={14} style={{ color: incident.severity === "critical" ? "#EF4444" : "#F59E0B" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#F1F5F9" }}>{incident.title}</span>
                    {severityBadge(incident.severity)}
                    {statusBadge(incident.status)}
                  </div>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>{incident.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                      <User size={10} /> {incident.assignedTo || "Unassigned"}
                    </span>
                    <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} /> {timeAgo(incident.createdAt)}
                    </span>
                    <span style={{ fontSize: 11, color: "#475569" }}>#{incident.id}</span>
                  </div>
                </div>
              </div>

              {incident.status !== "resolved" && incident.status !== "closed" && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  {incident.status === "open" && (
                    <button className="btn btn-secondary btn-xs" onClick={() => updateStatus(incident.id, "investigating")}>Investigate</button>
                  )}
                  {incident.status === "investigating" && (
                    <button className="btn btn-secondary btn-xs" onClick={() => updateStatus(incident.id, "resolved")}><CheckCircle size={12} /> Resolve</button>
                  )}
                  <div style={{ position: "relative" }}>
                    <button className="btn btn-secondary btn-xs"><Activity size={12} /> Actions</button>
                  </div>
                </div>
              )}
            </div>

            {/* Response actions */}
            {selectedIncident?.id === incident.id && (
              <div style={{ display: "flex", gap: 4, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                {responseActions.map(action => {
                  const Icon = action.icon;
                  return (
                    <button key={action.id} className="btn btn-secondary btn-xs" onClick={(e) => { e.stopPropagation(); executeAction(incident.id, action.id); }}
                      style={{ color: action.color, borderColor: `${action.color}20` }}>
                      <Icon size={12} /> {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Incident">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6 }}>Title</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Incident title" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6 }}>Description</label>
            <textarea className="input textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the incident" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6 }}>Severity</label>
              <select className="input select" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 6 }}>Assigned To</label>
              <input className="input" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="Team or person" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={createIncident}>Create Incident</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!selectedIncident && !showCreate} onClose={() => setSelectedIncident(null)} title={selectedIncident?.title || ""} width={520}>
        {selectedIncident && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {severityBadge(selectedIncident.severity)}
              {statusBadge(selectedIncident.status)}
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{selectedIncident.description}</p>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748B" }}>
              <span>Assigned: {selectedIncident.assignedTo || "Unassigned"}</span>
              <span>Created: {timeAgo(selectedIncident.createdAt)}</span>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.03)" }}>
              {responseActions.map(action => {
                const Icon = action.icon;
                return (
                  <button key={action.id} className="btn btn-secondary btn-sm" style={{ color: action.color, borderColor: `${action.color}20` }}>
                    <Icon size={12} /> {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default IncidentResponse;
