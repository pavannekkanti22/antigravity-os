import { useEffect, useState, useRef } from "react";
import { Bell, Search, Menu, LogOut, Terminal, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const avatarsList = [
  { id: "avatar1", name: "Indigo Commander", color: "from-indigo-500 to-cyan-500", icon: "🌌" },
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
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const notificationRef = useRef(null);
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
        loadNotifications();
      })
      .catch(err => console.error("Navbar profile load failed", err));
  }, [token]);

  const loadNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isImageAvatar = avatar && (avatar.startsWith("http") || avatar.startsWith("/") || avatar.startsWith("data:"));
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
       <div className="relative" ref={notificationRef}>
  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
    className="w-11 h-11 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer relative"
  >
    <Bell size={18} />

    {notifications.filter(n => !n.read).length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
        {notifications.filter(n => !n.read).length}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-3 w-[380px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden">

      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-white font-bold">
          Notifications
        </h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-zinc-500">
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className="p-4 border-b border-zinc-900 hover:bg-zinc-900/50"
            >
              <p className="text-white text-sm font-semibold">
                {notification.title}
              </p>

              <p className="text-zinc-400 text-xs mt-1">
                {notification.message}
              </p>

              <p className="text-zinc-600 text-[11px] mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  )}
</div>

        {/* Dynamic User Capsule */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/5">
          <div 
            onClick={() => navigate("/profile")}
            className={`w-11 h-11 rounded-2xl ${isImageAvatar ? "overflow-hidden" : `bg-gradient-to-br ${currentAvatarInfo.color}`} flex items-center justify-center text-xl shadow-lg hover:scale-105 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer`}
            title="View Profile Settings"
          >
            {isImageAvatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              currentAvatarInfo.icon
            )}
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