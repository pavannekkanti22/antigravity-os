import { useState, useEffect } from "react";
import { Clock, LogIn, Lock, User, Shield, Activity, AlertCircle } from "lucide-react";
import { api } from "../services/api";

const fallbackActivities = [
  { id: 1, type: "login", description: "Logged in from Chrome on Windows", createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: 2, type: "password_change", description: "Password changed successfully", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, type: "profile_update", description: "Profile information updated", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, type: "login", description: "Logged in from Safari on macOS", createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const activityConfig = {
  login: { icon: LogIn, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  password_change: { icon: Lock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  profile_update: { icon: User, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  security: { icon: Shield, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  system: { icon: Activity, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
};

function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getActivities().then(setActivities).catch(() => setActivities(fallbackActivities));
  }, []);

  const filtered = filter === "all" ? activities : activities.filter(a => a.type === filter);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Activity Timeline</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Track all actions and events on your account</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "login", "password_change", "profile_update", "security", "system"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer capitalize ${
              filter === f ? "bg-zinc-800 text-white" : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}>{f.replace("_", " ")}</button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-zinc-800"></div>
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Activity size={32} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No activity recorded yet</p>
            </div>
          ) : (
            filtered.map((act, i) => {
              const config = activityConfig[act.type] || activityConfig.system;
              const Icon = config.icon;
              return (
                <div key={act.id || i} className="relative flex gap-4 pl-12">
                  <div className={`absolute left-3 w-5 h-5 rounded-full border-2 ${config.color.split(" ").slice(-2).join(" ")} bg-zinc-900 flex items-center justify-center`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  </div>
                  <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900/80 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={config.color.split(" ")[0]} />
                        <span className="text-white text-sm font-medium capitalize">{act.type.replace("_", " ")}</span>
                      </div>
                      <span className="text-zinc-500 text-xs flex items-center gap-1">
                        <Clock size={10} /> {timeAgo(act.createdAt)}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-1">{act.description}</p>
                  </div>
                </div>
              );
            })
          )}
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
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default ActivityTimeline;