import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="app-background"></div>

      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>

      <div className="p-10 text-center text-sm text-gray-400 border-t border-white/5">
        Built with modern web technologies
      </div>
    </div>
  );
};

export default AppLayout;
