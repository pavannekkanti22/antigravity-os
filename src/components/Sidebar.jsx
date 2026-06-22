import {
  LayoutDashboard,
  User,
  Settings,
  Rocket,
  Shield,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");

 const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    title: "Profile Settings",
    icon: <User size={18} />,
    path: "/profile",
  },

  ...(role === "ADMIN"
    ? [
        {
          title: "System Settings",
          icon: <Settings size={18} />,
          path: "/settings",
        },
      ]
    : []),
];

  return (
    <aside className="hidden lg:flex w-64 h-[calc(100vh-8rem)] sticky top-28 bg-zinc-950/20 border border-white/5 rounded-[32px] p-5 flex-col justify-between backdrop-blur-3xl shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
      
      <div className="space-y-8">
        {/* SIDEBAR HEADER Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-md shadow-violet-500/10">
            <Rocket size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base tracking-wider uppercase font-mono">
              ANTIGRAVITY
            </h2>
            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono font-semibold">
              Enterprise OS
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 text-left cursor-pointer group text-sm font-mono ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500/10 to-transparent border-l-2 border-violet-500 text-violet-300"
                    : "text-zinc-400 hover:bg-zinc-900/40 hover:text-white"
                }`}
              >
                <div className={`${isActive ? "text-violet-400" : "group-hover:scale-110 text-zinc-400"} transition-all duration-300`}>
                  {item.icon}
                </div>
                <span>{item.title}</span>
              </button>
            );
          })}

          {/* ADMIN ACTION LINK */}
          {role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 text-left cursor-pointer font-mono text-sm ${
                location.pathname === "/admin"
                  ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300"
                  : "text-cyan-400/80 hover:bg-cyan-500/10 hover:text-cyan-300"
              }`}
            >
              <Shield size={18} />
              <span>Admin Console</span>
            </button>
          )}
        </nav>
      </div>

      {/* FOOTER METRICS PANEL */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>Uplink Status</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
          </div>
          <h4 className="text-white text-xs font-bold font-mono tracking-wide uppercase">All Clusters Syncing</h4>
          <p className="text-zinc-600 text-[9px] font-mono mt-1 leading-relaxed">
            Quantum security firewall telemetry: OK
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 cursor-pointer font-mono text-sm text-left"
        >
          <LogOut size={16} />
          <span>Exit Interface</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;