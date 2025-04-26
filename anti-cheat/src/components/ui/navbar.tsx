"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, Users, LogOut } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdmin");
      window.location.href = "/admin/login";
    }
  };

  // Don't show navbar on login page
  if (pathname === "/admin/login") return null;

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-slate-800 text-white p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-8 mt-4">
        <Shield className="h-8 w-8" />
        <h1 className="text-xl font-bold">Anti-Cheat Admin</h1>
      </div>

      <nav className="space-y-2">
        <NavItem
          href="/admin/exams"
          icon={<FileText className="h-5 w-5" />}
          label="Exams"
          active={pathname.includes("/admin/exams")}
        />
        <NavItem
          href="/admin/students"
          icon={<Users className="h-5 w-5" />}
          label="Students"
          active={pathname === "/admin/students"}
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-slate-700 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
        active ? "bg-slate-700 text-white" : "text-gray-300 hover:bg-slate-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
