import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsChart from "../components/AnalyticsChart";
import CommandTerminal from "../components/CommandTerminal";
import { Activity, Cpu, Server, Shield, Sparkles } from "lucide-react";

function Dashboard() {
  // Real-time telemetry states
  const [stats, setStats] = useState({
    revenue: 128430,
    activeClients: 2341,
    runningProjects: 128,
    systemGrowth: 18.0,
    cpu: 42.0,
    ram: 64.0,
  });

  const [activities, setActivities] = useState([
    "Security scan complete: Core stabilized",
    "Cognitive buffer indexing initialized",
    "Telemetry stream connected successfully",
    "Mission Control initialized under commander authority"
  ]);

  const [chartHistory, setChartHistory] = useState([
    { month: "T-10s", revenue: 40 },
    { month: "T-8s", revenue: 45 },
    { month: "T-6s", revenue: 42 },
    { month: "T-4s", revenue: 48 },
    { month: "T-2s", revenue: 44 },
    { month: "Now", revenue: 46 }
  ]);

  // Connect to SSE Telemetry stream
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/telemetry/stream");

    eventSource.addEventListener("telemetry", (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update stats
        setStats((prev) => ({
          revenue: data.revenue || prev.revenue,
          activeClients: data.activeClients || prev.activeClients,
          runningProjects: data.runningProjects || prev.runningProjects,
          systemGrowth: data.growth || prev.systemGrowth,
          cpu: data.cpu || prev.cpu,
          ram: data.ram || prev.ram,
        }));

        // Append to activity if present
        if (data.activity) {
          setActivities((prev) => [data.activity, ...prev.slice(0, 5)]);
        }

        // Add to chart rolling history (map CPU utilization as our live metric)
        setChartHistory((prev) => {
          const newPoint = {
            month: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            revenue: Math.round(data.cpu) // Use CPU as our performance metric plotted in the area chart
          };
          const nextHistory = [...prev.slice(1), newPoint];
          return nextHistory;
        });

      } catch (err) {
        console.error("Failed to parse telemetry event:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.warn("Telemetry connection failed. Reconnecting in background...", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const statsItems = [
    {
      title: "Revenue Operations",
      value: `$${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: "+18.4%",
      desc: "Gross enterprise value flow",
      color: "border-violet-500/20"
    },
    {
      title: "Active Core Nodes",
      value: stats.activeClients.toLocaleString(),
      growth: "+12.2%",
      desc: "Connections actively authenticated",
      color: "border-cyan-500/20"
    },
    {
      title: "Projects Deployed",
      value: stats.runningProjects.toString(),
      growth: "+9.0%",
      desc: "Workflows running inside threads",
      color: "border-fuchsia-500/20"
    },
    {
      title: "Cognitive Efficiency",
      value: `+${stats.systemGrowth.toFixed(2)}%`,
      growth: "+24.5%",
      desc: "AI-driven operational optimization",
      color: "border-emerald-500/20"
    },
  ];

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto">
      {/* HERO & TOP COMMAND BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-violet-400 animate-pulse" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
              Secure Session Active
            </span>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase font-mono">
            Antigravity OS <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Command Center</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm max-w-xl">
            Real-time visual monitoring of system telemetry, database constraints, and cognitive AI-agents.
          </p>
        </div>

        {/* Pulse Heartbeat */}
        <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 px-5 py-3 rounded-2xl shadow-xl">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-xs text-white font-bold font-mono tracking-wider">SECURE LINK ESTABLISHED</div>
            <div className="text-[10px] text-zinc-500 font-mono">NODE: SPRING_BOOT_CORE_8080</div>
          </div>
        </div>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`bg-zinc-950/40 border ${item.color} rounded-3xl p-6 backdrop-blur-3xl shadow-xl hover:shadow-black/55 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider font-mono">
                  {item.title}
                </span>
                <span className="text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {item.growth}
                </span>
              </div>
              <h2 className="text-white text-3xl font-black font-mono tracking-tight my-2">
                {item.value}
              </h2>
            </div>
            <p className="text-zinc-600 text-xs mt-3 italic border-t border-zinc-900/60 pt-3">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* DYNAMIC TELEMETRY ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* GRAPH PANEL */}
        <div className="xl:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-violet-400 animate-pulse" />
                <h2 className="text-white text-xl font-bold font-mono uppercase tracking-wider">
                  Live CPU Utilization
                </h2>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Real-time charting of backend processor threads load
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-violet-500 rounded-full"></span>
              <span className="text-zinc-400 text-xs font-mono font-bold">CPU Core Load (%)</span>
            </div>
          </div>

          <AnalyticsChart data={chartHistory} />
        </div>

        {/* DIALS & SYSTEM HEALTH PANEL */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-white text-xl font-bold font-mono uppercase tracking-wider mb-6 flex items-center gap-2">
              <Server size={18} className="text-cyan-400" />
              Resource Status
            </h2>
            
            <div className="space-y-6">
              {/* CPU PROGRESS */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5"><Cpu size={14} className="text-violet-400" /> CPU Allocation</span>
                  <span className="text-white font-bold">{stats.cpu.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-900/60 border border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.cpu}%` }}
                  ></div>
                </div>
              </div>

              {/* RAM PROGRESS */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5"><Server size={14} className="text-cyan-400" /> Memory Buffer</span>
                  <span className="text-white font-bold">{stats.ram.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-900/60 border border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.ram}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900/60">
            <div className="flex items-center gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
              <Shield size={20} className="text-cyan-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="text-white font-semibold block">H2 SQL Layer Secure</span>
                <span className="text-zinc-500">Transaction buffer encrypted with local SHA-256 integrity keys.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LAYOUT: TERMINAL + LOGS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* INTERACTIVE TERMINAL */}
        <div className="xl:col-span-2">
          <CommandTerminal />
        </div>

        {/* LOGS PANEL */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col h-[400px]">
          <h2 className="text-white text-xl font-bold font-mono uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity size={18} className="text-emerald-400" />
            Live Event Feed
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
            <AnimatePresence>
              {activities.map((act, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 text-xs bg-zinc-900/30 border border-zinc-900/80 p-3 rounded-2xl"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-400 mt-1 flex-shrink-0"></span>
                  <p className="text-zinc-400 font-mono leading-relaxed">{act}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;