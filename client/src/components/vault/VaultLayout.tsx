import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import VaultSidebar from "./VaultSidebar";
import VaultHeader from "./VaultHeader";

interface VaultLayoutProps {
  children?: ReactNode;
}

const VaultLayout = ({ children }: VaultLayoutProps) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex flex-col lg:flex-row">
      <VaultSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VaultHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default VaultLayout;