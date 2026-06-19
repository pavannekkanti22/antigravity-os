import { useState } from "react";
import { Shield, Lock, Smartphone, Monitor, Globe, Clock, CheckCircle, AlertTriangle, RefreshCw, Eye, EyeOff } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import DataGrid from "../components/ui/DataGrid";

const loginHistory = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  browser: ["Chrome 125", "Safari 18", "Firefox 128", "Edge 124"][i % 4],
  os: ["Windows 11", "macOS 15", "Ubuntu 24", "iOS 18"][i % 4],
  ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  location: ["New York, US", "San Francisco, US", "London, UK", "Tokyo, JP"][i % 4],
  status: ["success", "success", "failed", "success"][i % 4],
  time: `${Math.floor(Math.random() * 24)}h ago`,
}));

const activeSessions = [
  { id: 1, browser: "Chrome 125", os: "Windows 11", ip: "192.168.1.1", location: "New York, US", status: "active", lastActive: "Now" },
  { id: 2, browser: "Safari 18", os: "macOS 15", ip: "10.0.0.5", location: "San Francisco, US", status: "active", lastActive: "5m ago" },
];

const passwordChecks = [
  { label: "Minimum 8 characters", met: true },
  { label: "Uppercase letter", met: true },
  { label: "Lowercase letter", met: true },
  { label: "Number", met: false },
  { label: "Special character", met: false },
];

function SecurityCenter() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const columns = [
    { label: "Browser", accessor: "browser" },
    { label: "OS", accessor: "os" },
    { label: "IP Address", accessor: "ip" },
    { label: "Location", accessor: "location" },
    { label: "Status", accessor: "status", render: (v) => <StatusBadge variant={v === "success" ? "green" : "red"} dot>{v}</StatusBadge> },
    { label: "Time", accessor: "time" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", margin: 0 }}>Security Center</h1>
        <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>Manage security settings, password, and sessions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <StatCard icon={Shield} label="Security Score" value="78%" change={+5} color="cyan" />
        <StatCard icon={Lock} label="Active Sessions" value="2" color="blue" />
        <StatCard icon={Smartphone} label="Devices" value="3" color="violet" />
        <StatCard icon={AlertTriangle} label="Failed Logins (24h)" value="4" change={-60} color="red" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        {/* Password Strength */}
        <div className="surface-elevated">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={14} style={{ color: "#00D4FF" }} /> Password Health
            </h3>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>Strength</span>
                <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 500 }}>Medium</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "60%", borderRadius: 3, background: "linear-gradient(90deg, #EF4444, #F59E0B, #10B981)", transition: "width 0.3s" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {passwordChecks.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {c.met ? <CheckCircle size={12} style={{ color: "#10B981" }} /> : <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />}
                  <span style={{ fontSize: 12, color: c.met ? "#94A3B8" : "#64748B" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2FA */}
        <div className="surface-elevated">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Smartphone size={14} style={{ color: "#00D4FF" }} /> Two-Factor Authentication
            </h3>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>Authenticator App</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>TOTP-based 2FA</div>
              </div>
              <StatusBadge variant="green" dot>Enabled</StatusBadge>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-secondary btn-sm"><RefreshCw size={12} /> Rotate Key</button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="surface-elevated">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Monitor size={14} style={{ color: "#00D4FF" }} /> Active Sessions
          </h3>
          <button className="btn btn-danger btn-xs">Revoke All</button>
        </div>
        <div style={{ padding: "0 20px" }}>
          {activeSessions.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < activeSessions.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={14} style={{ color: "#00D4FF", opacity: 0.7 }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>{s.browser}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{s.os} · {s.ip}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge variant={s.status === "active" ? "green" : "gray"} dot>{s.status}</StatusBadge>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{s.lastActive}</div>
                </div>
                <button className="btn btn-danger btn-xs">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="surface-elevated">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} style={{ color: "#00D4FF" }} /> Login History
          </h3>
        </div>
        <DataGrid columns={columns} data={loginHistory.slice(0, 10)} />
      </div>
    </div>
  );
}

export default SecurityCenter;
