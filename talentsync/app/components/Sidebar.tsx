"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CalendarDays,
  Building2,
  UserRound,
  LogOut,
  FileCheck2,
} from "lucide-react";
import { useSession } from "./ProtectedRoute";
import { logoutUser } from "../services/auth";
import { errorMessage } from "../services/api";
export default function Sidebar() {
  const user = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const client = useQueryClient();
  const candidate = user.role === "CANDIDATE";
  const menu = candidate
    ? [
        { label: "Find jobs", href: "/candidateDashboard", icon: Briefcase },
        {
          label: "My applications",
          href: "/candidate/applications",
          icon: FileCheck2,
        },
        {
          label: "Interviews",
          href: "/candidate/interviews",
          icon: CalendarDays,
        },
        { label: "My profile", href: "/candidate/profile", icon: UserRound },
      ]
    : [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Job posts", href: "/jobposts/create", icon: Briefcase },
        { label: "Candidates", href: "/candidates", icon: Users },
        { label: "Interviews", href: "/interviews", icon: CalendarDays },
        { label: "Company", href: "/recruiter/company", icon: Building2 },
      ];
  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      client.clear();
      router.replace("/auth/login");
    },
  });
  return (
    <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-5 lg:px-6 lg:py-7">
        <Link
          href={candidate ? "/candidateDashboard" : "/dashboard"}
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            T
          </span>
          TalentSync
        </Link>
        <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 lg:hidden">
          {candidate ? "Student" : "Recruiter"}
        </span>
      </div>
      <p className="hidden px-6 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 lg:block">
        {candidate ? "Your next chapter" : "Recruiter workspace"}
      </p>
      <nav
        aria-label="Workspace"
        className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-2 lg:px-4"
      >
        {menu.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={
              "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition " +
              (pathname === href
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")
            }
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 lg:mt-auto lg:block lg:p-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {user.name}
          </p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>
        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-slate-500 hover:text-rose-600 lg:mt-3"
        >
          <LogOut size={16} />
          {logout.isPending ? "Signing out..." : "Sign out"}
        </button>
        {logout.isError && (
          <p role="alert" className="mt-2 text-xs text-rose-600">
            {errorMessage(logout.error)}
          </p>
        )}
      </div>
    </aside>
  );
}
