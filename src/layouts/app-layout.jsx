import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="w-full overflow-x-hidden relative">
      
      {/* Main page */}
      <main className="min-h-screen w-full relative" style={{ zIndex: 1 }}>
        {/* CONTAINER — THIS IS THE KEY */}
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
          <Header />
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10 py-10 flex flex-col items-center justify-center gap-4 text-center text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
             <span className="text-sm">✨</span> AI Powered
          </div>
          <p>© 2026 Jobly — AI Powered Job Platform</p>
        </div>
      </footer>

    </div>
  );
};

export default AppLayout;