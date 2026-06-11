import { useEffect, useState } from "react";
import {
  Sparkles,
  Activity,
  Server,
  Cpu,
  Shield,
  ArrowUpRight,
  TrendingUp,
  Terminal as TerminalIcon,
  Clock,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsChart from "../components/AnalyticsChart";
import CommandTerminal from "../components/CommandTerminal";

function Dashboard() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    createdAt: ""
  });
  const [stats, setStats] = useState({
    revenue: 128430,
    activeClients: 2341,
    runningProjects: 128,
    systemGrowth: 18.0,
    cpu: 42.0,
    ram: 64.0,
  });

  const [activities, setActivities] = useState([
    "Security scan complete: Core integrity verified",
    "Cognitive buffer indexing initialized on remote node",
    "Telemetry uplink synchronized with client socket",
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8081/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        console.error("Profile load failed:", err);
      });
  }, []);

  // Connect to SSE Telemetry stream
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8081/api/telemetry/stream");

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
        if (data.event) {
          setActivities((prev) => [data.event, ...prev.slice(0, 4)]);
        }

        // Add to chart rolling history (map CPU utilization as our live metric)
        setChartHistory((prev) => {
          const newPoint = {
            month: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            revenue: Math.round(data.cpu) // Use CPU as our performance metric plotted in the area chart
          };
          return [...prev.slice(1), newPoint];
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
      title: "Gross Value flow",
      value: `$${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: "+18.4%",
      desc: "Gross operations asset metrics",
      color: "border-violet-500/20",
      accent: "text-violet-400"
    },
    {
      title: "Authenticated Nodes",
      value: stats.activeClients.toLocaleString(),
      growth: "+12.2%",
      desc: "Live authenticated interfaces",
      color: "border-cyan-500/20",
      accent: "text-cyan-400"
    },
    {
      title: "Project Deployments",
      value: stats.runningProjects.toString(),
      growth: "+9.0%",
      desc: "System thread operations active",
      color: "border-fuchsia-500/20",
      accent: "text-fuchsia-400"
    },
    {
      title: "AI Efficiency Index",
      value: `+${stats.systemGrowth.toFixed(2)}%`,
      growth: "+24.5%",
      desc: "Optimized network performance",
      color: "border-emerald-500/20",
      accent: "text-emerald-400"
    },
  ];

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-12">
      
      {/* HERO & DYNAMIC PULSE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-violet-400 animate-pulse" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
              Secure Commander Link Active
            </span>
          </div>
          
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase font-mono">
            COMMAND CENTER <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">UPLINK</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1.5 font-mono">
            OPERATING UNDER CLEARANCE LEVEL: <span className="text-cyan-400 font-bold uppercase">{profile.role || "USER"}</span>
          </p>
        </div>

        {/* Pulse Status Widget */}
        <div className="flex items-center gap-4 bg-zinc-950/40 border border-white/5 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-xl">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-xs text-white font-bold font-mono tracking-wider">UPLINK SYNCHRONIZED</div>
            <div className="text-[9px] text-zinc-500 font-mono uppercase">Node: LOCAL_SPRING_BOOT</div>
          </div>
        </div>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-3xl shadow-xl flex flex-col justify-between hover:border-white/10 group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">
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
            <p className="text-zinc-500 text-[10px] font-mono mt-3 border-t border-white/5 pt-3 flex items-center justify-between">
              <span>{item.desc}</span>
              <ArrowUpRight size={12} className="text-zinc-600 group-hover:text-white transition-colors duration-300" />
            </p>
          </motion.div>
        ))}
      </div>

      {/* TELEMETRY CHART ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* GRAPH PANEL */}
        <div className="xl:col-span-2 bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-violet-400 animate-pulse" />
                <h2 className="text-white text-lg font-bold font-mono uppercase tracking-wider">
                  Live CPU Utilization
                </h2>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Real-time charting of processing core load threads.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-white/5 px-3.5 py-1.5 rounded-xl">
              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full animate-ping"></span>
              <span className="text-zinc-300 text-xs font-mono font-bold">CPU Core load (%)</span>
            </div>
          </div>

          <AnalyticsChart data={chartHistory} />
        </div>

        {/* RESOURCE ALLOCATIONS */}
        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-white text-lg font-bold font-mono uppercase tracking-wider mb-6 flex items-center gap-2">
              <Server size={18} className="text-cyan-400" />
              Resource Telemetry
            </h2>
            
            <div className="space-y-6">
              {/* CPU PROGRESS */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5"><Cpu size={14} className="text-violet-400" /> CPU Allocation</span>
                  <span className="text-white font-bold">{stats.cpu.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-900/60 border border-white/5 rounded-full overflow-hidden">
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
                <div className="w-full h-3 bg-zinc-900/60 border border-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.ram}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
              <Shield size={20} className="text-cyan-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="text-white font-semibold block">H2 SQL Layer Secure</span>
                <span className="text-zinc-500">Local transaction buffers encrypted with local SHA-256 integrity keys.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* TERMINAL & ACTIONS LOG */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CommandTerminal />
        </div>

        {/* LOG FEED */}
        <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col h-[400px]">
          <h2 className="text-white text-lg font-bold font-mono uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock size={18} className="text-emerald-400 animate-pulse" />
            Uplink Signal Feed
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
                  className="flex gap-3 text-xs bg-zinc-900/20 border border-white/5 p-3 rounded-2xl hover:bg-zinc-900/30 transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0"></span>
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