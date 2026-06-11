import { Sparkles, Terminal, ShieldAlert, Cpu } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Ambient Neon Blurs */}
      <div className="absolute top-[-300px] left-[-200px] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Main Glassmorphic Wrapper */}
      <div className="w-full max-w-6xl min-h-[720px] bg-zinc-950/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] relative z-10 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Interactive Presentation Console */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-16 border-r border-white/5 relative overflow-hidden bg-zinc-950/20">
          <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10">
            {/* BRAND */}
            <div className="flex items-center gap-4 mb-14">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-bold text-xl font-mono">A</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-black font-mono tracking-widest text-glow-violet">
                  ANTIGRAVITY
                </h1>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono font-semibold">
                  Enterprise Platform
                </p>
              </div>
            </div>

            {/* TYPOGRAPHY HERO */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">
                <Sparkles size={10} className="animate-pulse" /> Core System Version 4.1
              </span>
              <h2 className="text-white text-5xl xl:text-6xl font-black leading-tight tracking-tight uppercase font-mono">
                QUANTUM INTERFACE<br />
                FOR MODERN<br />
                OPERATIONS.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                Experience high-performance client operations powered by secure role permissions, real-time analytics, dynamic visual telemetry, and command terminal scripts.
              </p>
            </div>
          </div>

          {/* FLOATING GLASS TELEMETRY CARDS */}
          <div className="relative z-10 space-y-4">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-lg hover:border-violet-500/25 transition-all duration-500 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-cyber"></div>
                  <span className="text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">System Core Synchronized</span>
                </div>
                <span className="text-zinc-600 text-xs font-mono">NODE: SPRING_BOOT_CORE</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                “Authentication, analytics endpoints, and administrative console controls mapped directly onto H2/MySQL core.”
              </p>
            </div>

            {/* MICRO STATS BAR */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-zinc-500 text-[9px] uppercase tracking-wider block font-mono">Latency</span>
                <span className="text-white font-bold font-mono text-sm">1.2ms</span>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-zinc-500 text-[9px] uppercase tracking-wider block font-mono">Integrity</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">99.9%</span>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-zinc-500 text-[9px] uppercase tracking-wider block font-mono">Uplinks</span>
                <span className="text-violet-400 font-bold font-mono text-sm">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Dynamic Form Container */}
        <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-8 lg:p-14 relative bg-[#020203]/40">
          <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10 w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;