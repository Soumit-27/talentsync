"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CalendarCheck,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Jobs",
    icon: Briefcase,
    href: "/jobposts/create",
  },
  {
    label: "Candidates",
    icon: Users,
    href: "/candidates",
  },
  {
    label: "Interviews",
    icon: CalendarCheck,
    href: "/interviews",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  // Don't show recruiter sidebar on candidate pages
  if (
    pathname === "/candidateDashboard" ||
    pathname.startsWith("/candidate/profile")
  ) {
    return null;
  }

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-600">TalentSync</h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 py-5 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center ${
                collapsed ? "justify-center" : "justify-start"
              } gap-3 px-4 py-3 rounded-xl mb-2 transition-all
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />

              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
