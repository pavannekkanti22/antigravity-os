import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="bg-[#020203] min-h-screen relative overflow-x-hidden flex flex-col">
      
      {/* Ambient Background Glow Signals */}
      <div className="absolute top-[-300px] left-[-200px] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

      {/* TOP NAVIGATION */}
      <Navbar />

      {/* BODY COLUMN PANEL */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 px-4 sm:px-8 py-8 relative z-10 max-w-[1800px] mx-auto w-full">
        <Sidebar />

        <main className="flex-1 min-w-0 z-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;