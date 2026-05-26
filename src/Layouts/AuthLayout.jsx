function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center relative overflow-hidden px-6">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-250px] left-[-150px] w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[140px]"></div>

      <div className="absolute bottom-[-250px] right-[-150px] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[140px]"></div>

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl min-h-[750px] bg-zinc-950/70 border border-zinc-800 rounded-[40px] overflow-hidden backdrop-blur-2xl shadow-2xl shadow-black/50 relative z-10 grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-16 border-r border-zinc-800 relative overflow-hidden">

          {/* LEFT GLOW */}
          <div className="absolute top-0 right-[-100px] w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-[120px]"></div>

          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-10">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">

                <span className="text-white text-2xl font-bold">
                  A
                </span>

              </div>

              <div>

                <h1 className="text-white text-2xl font-bold tracking-wide">
                  ANTIGRAVITY
                </h1>

                <p className="text-zinc-500 text-sm">
                  Enterprise Operating System
                </p>

              </div>

            </div>

            <h2 className="text-white text-6xl font-bold leading-tight max-w-lg">
              Intelligent
              Enterprise
              Infrastructure.
            </h2>

            <p className="text-zinc-500 text-lg mt-8 leading-relaxed max-w-xl">
              Advanced operational management powered by
              real-time analytics, AI automation,
              and futuristic workflow intelligence.
            </p>

          </div>

          {/* BOTTOM CARD */}
          <div className="relative z-10">

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>

                <span className="text-emerald-400 text-sm font-medium">
                  System Active
                </span>

              </div>

              <p className="text-zinc-400 leading-relaxed text-lg">
                “Antigravity transformed our operational ecosystem
                into a fully intelligent command infrastructure.”
              </p>

              <h3 className="text-white font-semibold mt-6">
                — Enterprise Systems Division
              </h3>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 lg:p-16 relative">

          {/* RIGHT SIDE GLOW */}
          <div className="absolute bottom-[-120px] left-[-80px] w-[250px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10 w-full">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;