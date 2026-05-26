import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="bg-[#020203] min-h-screen relative overflow-x-hidden flex flex-col">
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-[-250px] left-[-150px] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="absolute bottom-[-250px] right-[-150px] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <Navbar />

      <div className="flex-1 flex gap-8 px-8 py-8 relative z-10 max-w-[1800px] mx-auto w-full">
        <Sidebar />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;