import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Rocket,
} from "lucide-react";

function Sidebar() {

  const menuItems = [
    {
      title: "Overview",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Projects",
      icon: <FolderKanban size={20} />,
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 h-[calc(100vh-8rem)] sticky top-28 bg-zinc-950/20 border border-zinc-900/80 rounded-[32px] p-6 flex-col justify-between backdrop-blur-3xl shadow-xl shadow-black/50">

      <div>

        <div className="flex items-center gap-3 mb-14">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">

            <Rocket className="text-white" />

          </div>

          <div>

            <h1 className="text-white font-bold text-xl">
              ANTIGRAVITY
            </h1>

            <p className="text-zinc-500 text-sm">
              Enterprise OS
            </p>

          </div>

        </div>

        <nav className="space-y-3">

          {menuItems.map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 cursor-pointer group"
            >

              <div className="group-hover:scale-110 transition-all duration-300">

                {item.icon}

              </div>

              <span className="font-medium">
                {item.title}
              </span>

            </div>

          ))}

        </nav>

      </div>

      <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-zinc-800 rounded-3xl p-5 backdrop-blur-xl">

        <p className="text-zinc-400 text-sm mb-2">
          System Status
        </p>

        <h2 className="text-white text-xl font-bold mb-3">
          All Systems Active
        </h2>

        <div className="flex items-center gap-2">

          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>

          <span className="text-emerald-400 text-sm">
            Operational
          </span>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;