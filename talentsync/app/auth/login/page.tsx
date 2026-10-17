"use client"; // <--- Add this at the absolute top of the file

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { loginUser, LoginResponse } from "@/app/services/auth";

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
    <div className="min-h-screen bg-[#FBF8F3] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Ambient background glow — signature element */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-[32rem] h-[32rem] rounded-full bg-amber-300/20 blur-[120px] animate-drift-slow" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-rose-200/25 blur-[120px] animate-drift-slow-reverse" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl bg-white rounded-[28px] overflow-hidden shadow-2xl shadow-slate-900/10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] border border-slate-100 relative z-10 animate-rise-in">
        {/* LEFT SIDE (Marketing/Features) */}
        <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-10 xl:p-12 text-slate-900 border-r border-slate-100">
          {/* subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              opacity: 0.03,
            }}
          />

          {/* Logo */}
          <div
            className="relative z-10 flex items-center gap-2.5 animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_2px_rgba(245,158,11,0.4)] animate-pulse-soft" />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Talent<span className="text-amber-600">Sync</span>
            </h1>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-md my-auto space-y-9">
            <div
              className="animate-fade-up"
              style={{ animationDelay: "140ms" }}
            >
              <p className="uppercase tracking-[3px] text-amber-600 text-[11px] font-semibold mb-4">
                Recruitment, reimagined
              </p>
              <h2 className="text-4xl xl:text-[3.25rem] font-semibold tracking-tight leading-[1.08] mb-4 text-slate-900">
                Every great hire
                <br />
                starts with a signal.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                Track applicants, run interviews, and close roles — all in one
                calm, connected workspace.
              </p>
            </div>

            {/* FEATURES */}
            <div className="space-y-4">
              {[
                {
                  icon: "→",
                  title: "Fast-moving pipelines",
                  desc: "See every candidate's status at a glance.",
                },
                {
                  icon: "◆",
                  title: "Verified access",
                  desc: "Enterprise-grade authentication, by default.",
                },
                {
                  icon: "◎",
                  title: "One shared dashboard",
                  desc: "Jobs, interviews, and offers in sync.",
                },
              ].map((f, i) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3.5 group animate-fade-up"
                  style={{ animationDelay: `${220 + i * 90}ms` }}
                >
                  <div className="w-8 h-8 mt-0.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 text-sm shrink-0 transition-colors duration-300 group-hover:border-amber-300 group-hover:bg-amber-50">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">
                      {f.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="relative z-10 text-slate-400 text-xs animate-fade-up"
            style={{ animationDelay: "520ms" }}
          >
            © 2026 TalentSync. All rights reserved.
          </div>
        </div>

        {/* RIGHT SIDE (Login Form) */}
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8 animate-fade-up">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                  Talent<span className="text-amber-500">Sync</span>
                </h1>
              </div>
            </div>

            {/* Header */}
            <div
              className="mb-7 animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              <h2 className="text-[1.75rem] sm:text-3xl font-semibold text-slate-900 tracking-tight mb-1.5">
                Welcome back
              </h2>
              <p className="text-slate-500 text-sm">
                Sign in to keep your hiring moving.
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div
                className="animate-fade-up"
                style={{ animationDelay: "150ms" }}
              >
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400"
                />
              </div>

              {/* Password */}
              <div
                className="animate-fade-up"
                style={{ animationDelay: "210ms" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-11 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div
                className="flex items-center gap-2 pt-0.5 animate-fade-up"
                style={{ animationDelay: "260ms" }}
              >
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-slate-600 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 rounded-xl text-white font-medium text-sm transition-all duration-200 shadow-md shadow-slate-900/10 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 animate-fade-up"
                style={{ animationDelay: "310ms" }}
              >
                {loginMutation.isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              className="my-6 flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              <div className="flex-1 h-px bg-slate-200" />
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider whitespace-nowrap">
                OR CONTINUE WITH
              </p>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social Buttons */}
            <div
              className="grid grid-cols-2 gap-3 animate-fade-up"
              style={{ animationDelay: "410ms" }}
            >
              <button className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                Google
              </button>
              <button className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                GitHub
              </button>
            </div>

            {/* Register */}
            <p
              className="text-center text-slate-500 mt-7 text-xs animate-fade-up"
              style={{ animationDelay: "460ms" }}
            >
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/auth/register")}
                className="text-amber-600 font-semibold cursor-pointer hover:text-amber-700 transition-colors"
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rise-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-soft {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes drift-slow {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -20px);
          }
        }
        @keyframes drift-slow-reverse {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-30px, 20px);
          }
        }
        .animate-rise-in {
          animation: rise-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-fade-up {
          animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2.4s ease-in-out infinite;
        }
        .animate-drift-slow {
          animation: drift-slow 14s ease-in-out infinite;
        }
        .animate-drift-slow-reverse {
          animation: drift-slow-reverse 16s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-rise-in,
          .animate-fade-up,
          .animate-pulse-soft,
          .animate-drift-slow,
          .animate-drift-slow-reverse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
