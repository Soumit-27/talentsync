"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ProtectedRoute from "./ProtectedRoute";
const publicRoutes = new Set([
  "/",
  "/auth/login",
  "/auth/register",
  "/forgot_password",
  "/reset-password",
  "/jobs",
]);
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (publicRoutes.has(pathname)) return <>{children}</>;
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
