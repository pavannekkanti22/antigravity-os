import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Users, Building2, FileText, Settings, LogOut, ArrowLeft, Sparkles } from "lucide-react";

const navItems = [
  { label: "User Management", icon: Users, path: "/admin" },
  { label: "Role Management", icon: Shield, path: "/admin/roles" },
  { label: "Organizations", icon: Building2, path: "/admin/organizations" },
  { label: "Audit & Compliance", icon: FileText, path: "/admin/audit" },
  { label: "System Settings", icon: Settings, path: "/admin/settings" },
];

function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ background: "#050816", minHeight: "100vh", display: "flex" }}>
      <div className="bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,212,255,0.02) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{ width: 240, height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", background: "rgba(10, 16, 32, 0.6)", borderRight: "1px solid rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", zIndex: 1, flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00D4FF, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>Antigravity</div>
              <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Console</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6,
                  border: "none", cursor: "pointer", fontSize: 13,
                  background: active ? "rgba(0,212,255,0.06)" : "transparent",
                  color: active ? "#00D4FF" : "#64748B",
                  transition: "all 0.12s", marginBottom: 2,
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#94A3B8"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; } }}>
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, color: "#64748B", background: "transparent", marginBottom: 2 }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#94A3B8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, color: "#475569", background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,63,94,0.04)"; e.currentTarget.style.color = "#FB7185"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>{subtitle}</p>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.06)", borderRadius: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.3)" }} />
            <span style={{ fontSize: 11, color: "#64748B" }}>System Online</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
