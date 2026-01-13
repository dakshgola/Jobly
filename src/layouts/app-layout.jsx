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
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10 py-10 text-center text-sm text-gray-400">
          Built with modern web technologies
        </div>
      </footer>

    </div>
  );
};

export default AppLayout;