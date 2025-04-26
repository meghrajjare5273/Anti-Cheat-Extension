import type React from "react";
import { Navbar } from "./navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
}
