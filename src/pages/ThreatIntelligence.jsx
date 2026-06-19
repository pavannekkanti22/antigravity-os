import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Globe, TrendingUp, Activity, Ban, Skull, Clock, MapPin, Monitor } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import DataGrid, { severityBadge } from "../components/ui/DataGrid";

const fallbackThreats = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  type: ["failed_login", "suspicious_ip", "impossible_travel", "new_device", "brute_force", "vpn_proxy"][i % 6],
  ip: `185.220.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  location: ["Moscow, RU", "Beijing, CN", "San Francisco, US", "New York, US", "Paris, FR", "Lagos, NG"][i % 6],
  user: ["admin@antigravity.io", "james@example.com", "sarah@example.com", "mike@example.com", "unknown"][i % 5],
  risk: ["critical", "high", "medium", "low"][i % 4],
  detail: ["5 failed attempts in 3 minutes", "Login from unusual geographic location", "Impossible travel detected", "Login from unrecognized device", "Brute force attack — 50+ attempts", "Login via known VPN/proxy"][i % 6],
  time: `${Math.floor(Math.random() * 12)}h ago`,
}));

function ThreatIntelligence() {
  const [threats] = useState(fallbackThreats);
  const stats = {
    total: threats.length,
    critical: threats.filter(t => t.risk === "critical").length,
    high: threats.filter(t => t.risk === "high").length,
    blocked: threats.filter(t => t.type === "brute_force").length,
  };

  const columns = [
    { label: "Type", accessor: "type", render: (v) => <span style={{ textTransform: "capitalize", fontSize: 13, fontWeight: 500, color: "#F1F5F9" }}>{v.replace("_", " ")}</span> },
    { label: "Risk", accessor: "risk", render: (v) => severityBadge(v) },
    { label: "IP Address", accessor: "ip" },
    { label: "Location", accessor: "location" },
    { label: "User", accessor: "user" },
    { label: "Detail", accessor: "detail" },
    { label: "Time", accessor: "time" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", margin: 0 }}>Threat Intelligence</h1>
        <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>Real-time threat monitoring and risk analysis</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard icon={AlertTriangle} label="Total Threats" value={stats.total} color="red" />
        <StatCard icon={Skull} label="Critical" value={stats.critical} color="red" />
        <StatCard icon={TrendingUp} label="High Risk" value={stats.high} color="amber" />
        <StatCard icon={Ban} label="Blocked Today" value={stats.blocked} change={-12} color="green" />
      </div>

      {/* Threat Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div className="surface-elevated">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={14} style={{ color: "#00D4FF" }} /> Severity Distribution
            </h3>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Critical", count: stats.critical, color: "#EF4444" },
              { label: "High", count: stats.high, color: "#F59E0B" },
              { label: "Medium", count: threats.filter(t => t.risk === "medium").length, color: "#3B82F6" },
              { label: "Low", count: threats.filter(t => t.risk === "low").length, color: "#64748B" },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: "#F1F5F9", fontWeight: 500 }}>{item.count}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(item.count / Math.max(stats.total, 1)) * 100}%`, borderRadius: 2, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="surface-elevated">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={14} style={{ color: "#00D4FF" }} /> Top Threat Vectors
            </h3>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Login Velocity", value: 72, color: "#F59E0B" },
              { label: "Geo-Anomaly", value: 45, color: "#3B82F6" },
              { label: "Device Trust", value: 88, color: "#10B981" },
              { label: "Brute Force Score", value: 34, color: "#EF4444" },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: "#F1F5F9", fontWeight: 500 }}>{item.value}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.value}%`, borderRadius: 3, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Feed */}
      <div className="surface-elevated" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={14} style={{ color: "#00D4FF" }} /> Live Threat Feed
          </span>
          <StatusBadge variant="green" dot>Live</StatusBadge>
        </div>
        <DataGrid columns={columns} data={threats.slice(0, 10)} />
      </div>
    </div>
  );
}

export default ThreatIntelligence;
