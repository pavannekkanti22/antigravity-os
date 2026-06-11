import { useEffect, useState } from "react";
import { Bell, Search, Menu, LogOut, Terminal, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const avatarsList = [
  { id: "avatar1", name: "Cyber Commander", color: "from-cyan-500 to-blue-500", icon: "🌌" },
  { id: "avatar2", name: "Neural Hacker", color: "from-violet-500 to-fuchsia-500", icon: "⚡" },
  { id: "avatar3", name: "Quantum Operator", color: "from-emerald-500 to-green-500", icon: "🧩" },
  { id: "avatar4", name: "Matrix Agent", color: "from-amber-500 to-orange-500", icon: "🕶️" },
  { id: "avatar5", name: "AI Singularity", color: "from-pink-500 to-rose-500", icon: "🔮" },
  { id: "avatar6", name: "Grid Architect", color: "from-teal-500 to-cyan-500", icon: "🌐" }
];

function Navbar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("avatar1");
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8081/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        if (data.avatar) {
          setAvatar(data.avatar);
        }
      })
      .catch(err => console.error("Navbar profile load failed", err));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const currentAvatarInfo = avatarsList.find(a => a.id === avatar) || avatarsList[0];

  return (
    <header className="h-20 border-b border-white/5 bg-zinc-950/40 backdrop-blur-2xl flex items-center justify-between px-6 sm:px-8 sticky top-0 z-50">
      
      {/* Welcome Designation & Status */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300">
          <Menu size={18} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-white text-base sm:text-lg font-black font-mono tracking-wider uppercase">
              Mission Control
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <Activity size={8} /> Online
            </div>
          </div>
          <p className="text-zinc-500 text-xs mt-0.5 hidden sm:block">
            Commander Identity: <span className="text-zinc-300 font-mono">{profile?.fullName || "Awaiting Auth..."}</span>
          </p>
        </div>
      </div>

      {/* Inputs & Operations Widgets */}
      <div className="flex items-center gap-4">
        
        {/* Sleek Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-4.5 top-3.5 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Query telemetry matrix..."
            className="bg-black/50 border border-white/5 rounded-2xl pl-11 pr-5 py-2.5 text-xs text-white outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all duration-300 w-64 font-mono"
          />
        </div>

        {/* Notifications Alert Center */}
        <button className="w-11 h-11 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all duration-300 cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500 pulse-cyber"></span>
        </button>

        {/* Dynamic User Capsule */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/5">
          <div 
            onClick={() => navigate("/profile")}
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${currentAvatarInfo.color} flex items-center justify-center text-xl shadow-lg hover:scale-105 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer`}
            title="View Profile Settings"
          >
            {currentAvatarInfo.icon}
          </div>

          <div className="hidden xl:block text-left">
            <span className="text-white text-xs font-bold block truncate max-w-[100px]">
              {profile?.fullName || "Loading..."}
            </span>
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block">
              {profile?.role || "USER"}
            </span>
          </div>

          {/* Quick Exit */}
          <button
            onClick={handleLogout}
            className="w-11 h-11 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-300 cursor-pointer"
            title="End Mission Session"
          >
            <LogOut size={16} />
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;