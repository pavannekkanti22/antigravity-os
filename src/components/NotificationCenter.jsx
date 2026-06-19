import { useState, useEffect, useRef } from "react";
import { Bell, Check, AlertCircle, Info, Shield, X } from "lucide-react";
import { api } from "../services/api";

const fallbackNotifications = [
  { id: 1, type: "info", title: "Welcome!", message: "Your account has been created successfully.", read: false, createdAt: new Date().toISOString() },
  { id: 2, type: "security", title: "Security Scan Complete", message: "Core integrity verified. No threats detected.", read: false, createdAt: new Date().toISOString() },
];

const icons = { info: Info, alert: AlertCircle, security: Shield, success: Check };
const colors = { info: "text-blue-400 bg-blue-500/10", alert: "text-amber-400 bg-amber-500/10", security: "text-violet-400 bg-violet-500/10", success: "text-emerald-400 bg-emerald-500/10" };

export function NotificationDropdown({ onViewAll }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    api.getNotifications().then(setNotifications).catch(() => setNotifications(fallbackNotifications));
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markRead = async (id) => {
    await api.markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer relative">
        <Bell size={16} />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-white text-sm font-medium">Notifications</span>
            <button onClick={onViewAll} className="text-xs text-zinc-400 hover:text-white transition cursor-pointer">View all</button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">No notifications</div>
            ) : (
              notifications.slice(0, 5).map((n) => {
                const Icon = icons[n.type] || Info;
                const color = colors[n.type] || colors.info;
                return (
                  <div key={n.id} className={`p-3 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition cursor-pointer ${!n.read ? "bg-zinc-800/10" : ""}`} onClick={() => markRead(n.id)}>
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{n.title}</p>
                        <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-zinc-600 text-[10px] mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0"></span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getNotifications().then(setNotifications).catch(() => setNotifications(fallbackNotifications));
  }, []);

  const markRead = async (id) => {
    await api.markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await api.markAllNotificationsRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => filter === "all" ? true : filter === "unread" ? !n.read : n.type === filter);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Stay updated with system alerts and activities</p>
        </div>
        <button onClick={markAllRead} className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer">
          <Check size={14} /> Mark all read
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "info", "security", "alert", "success"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer capitalize ${
              filter === f ? "bg-zinc-800 text-white" : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}>{f}</button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No notifications found</p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = icons[n.type] || Info;
            const color = colors[n.type] || colors.info;
            return (
              <div key={n.id} className={`p-4 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition cursor-pointer ${!n.read ? "bg-zinc-800/10" : ""}`} onClick={() => markRead(n.id)}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-medium">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0"></span>}
                    </div>
                    <p className="text-zinc-400 text-sm mt-0.5">{n.message}</p>
                    <p className="text-zinc-600 text-xs mt-1.5">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
