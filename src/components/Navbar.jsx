import { Bell, Search, Menu } from "lucide-react";

function Navbar() {
  return (
    <header className="h-20 border-b border-zinc-900 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
     <div className="flex items-center gap-4">

  <button className="lg:hidden w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300">
    <Menu size={20} />
  </button>

  <div>
    <h1 className="text-white text-2xl font-bold">
      Mission Control
    </h1>

    <p className="text-zinc-500 text-sm mt-1">
      Welcome back, Commander
    </p>
  </div>

</div>

      <div className="flex items-center gap-5">
        
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-5 py-3 text-sm text-white outline-none focus:border-violet-500 transition-all duration-300 w-72"
          />
        </div>
<button className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300">
  
  <Bell size={20} />

</button>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500"></div>
      </div>
    </header>
  );
}

export default Navbar;