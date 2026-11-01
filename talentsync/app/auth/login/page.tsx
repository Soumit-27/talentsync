"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Search,
  BellRing,
  LayoutDashboard,
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { loginUser, LoginResponse } from "@/app/services/auth";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const HIGHLIGHTS = [
  {
    Icon: Search,
    title: "Fresh roles every day",
    desc: "Thousands of verified openings across India.",
  },
  {
    Icon: BellRing,
    title: "Real-time updates",
    desc: "Know the moment an application moves forward.",
  },
  {
    Icon: LayoutDashboard,
    title: "One simple dashboard",
    desc: "Jobs, applicants and interviews in one place.",
  },
];

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "CANDIDATE") {
        router.push("/candidate/profile");
      } else {
        router.push("/dashboard");
      }
    },

    onError: (error) => {
      console.error(error);
      alert("Login Failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      className={`${font.className} min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-white antialiased`}
    >
      {/* LEFT: brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />

        <div className="relative z-10 flex w-full flex-col justify-between p-14">
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-extrabold text-indigo-600">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">TalentSync</span>
          </Link>

          <div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              Welcome back.
              <br />
              Let&apos;s get moving.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-indigo-100">
              Log in to pick up where you left off, whether you&apos;re hunting
              for a role or hiring for one.
            </p>

            <div className="mt-10 space-y-5">
              {HIGHLIGHTS.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-0.5 text-sm text-indigo-200">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-indigo-200">
            © 2026 TalentSync. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex w-fit items-center gap-2.5 lg:hidden"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white">
              T
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              TalentSync
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-slate-600">Enter your details to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-800"
              >
                Email address
              </label>
              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-800"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => router.push("/forgot_password")}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer select-none text-sm text-slate-600"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-400">
              OR CONTINUE WITH
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Google
            </button>
            <button className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              GitHub
            </button>
          </div>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
