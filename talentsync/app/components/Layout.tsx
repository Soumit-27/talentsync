"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register";

  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 bg-slate-100">{children}</main>
    </div>
  );
}