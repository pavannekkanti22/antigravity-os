import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { Database, Activity } from "lucide-react";

function AnalyticsDashboard({ analytics }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: analytics.totalUsers, color: "text-white", border: "border-zinc-800" },
          { label: "Active", value: analytics.activeUsers, color: "text-cyan-400", border: "border-cyan-500/10" },
          { label: "Admins", value: analytics.admins, color: "text-violet-400", border: "border-violet-500/10" },
          { label: "Logins", value: analytics.totalLogins, color: "text-emerald-400", border: "border-emerald-500/10" },
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl border ${item.border} bg-[#0a0a0f]/60 p-5 dark-card`}>
            <p className="text-zinc-500 text-xs mb-1 font-mono uppercase tracking-wider">{item.label}</p>
            <h2 className={`text-2xl font-bold ${item.color} font-mono`}>{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl dark-card p-6">
          <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
            <Database size={14} className="text-cyan-400" /> User Growth
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRegistrations || []}>
                <defs>
                  <linearGradient id="cyanUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                <YAxis stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", color: "#fff", fontFamily: "monospace" }} />
                <Area type="monotone" dataKey="users" stroke="#06b6d4" fillOpacity={1} fill="url(#cyanUsers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl dark-card p-6">
          <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity size={14} className="text-violet-400" /> Activity Distribution
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Signins", count: analytics.totalLogins },
                { name: "Resets", count: analytics.totalPasswordResets },
                { name: "Promotions", count: analytics.totalRoleChanges }
              ]}>
                <XAxis dataKey="name" stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                <YAxis stroke="#52525b" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", color: "#fff", fontFamily: "monospace" }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;