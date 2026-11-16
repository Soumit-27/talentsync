"use client";
import { errorMessage } from "@/app/services/api";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  ArrowRight,
  Check,
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { registerUser } from "@/app/services/auth";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ROLES = [
  {
    value: "CANDIDATE",
    title: "I'm looking for a job",
    desc: "Find roles, apply in one click",
    Icon: Briefcase,
  },
  {
    value: "RECRUITER",
    title: "I'm hiring",
    desc: "Post jobs, manage applicants",
    Icon: Building2,
  },
];

const PERKS = [
  "Apply to roles with a single profile",
  "Follow application and interview updates",
  "Create one profile for every application",
];

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

function RegisterContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(
    params.get("role") === "RECRUITER" ? "RECRUITER" : "CANDIDATE",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/auth/login?registered=1");
    },
    onError: (error) => {
      setError(errorMessage(error));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    registerMutation.mutate({ name, email, password, role });
  };

  const strength = Math.min(
    4,
    (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0),
  );
  const strengthLabel = ["Too weak", "Weak", "Okay", "Good", "Strong"][
    strength
  ];
  const strengthColor = [
    "bg-slate-200",
    "bg-rose-400",
    "bg-amber-400",
    "bg-lime-500",
    "bg-emerald-500",
  ][strength];

  return (
    <div
      className={`${font.className} min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-white antialiased`}
    >
      {/* LEFT: brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />

        <div className="relative z-10 flex w-full flex-col justify-between p-14">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-extrabold text-indigo-600">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">TalentSync</span>
          </Link>

          <div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              Your next chapter
              <br />
              starts here.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-indigo-100">
              Connect with employers, explore opportunities, and keep your applications in one place.
            </p>

            <ul className="mt-9 space-y-4">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-indigo-50">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <p className="leading-7 text-indigo-50">
              Create your profile once. Explore jobs and internships, apply when you are ready, and follow your progress in your workspace.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 font-bold">
                A
              </span>
              <div>
                <p className="text-sm font-semibold">One profile. More possibilities.</p>
                <p className="text-xs text-indigo-200">
                  Your TalentSync workspace
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2.5 lg:hidden w-fit"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white">
              T
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              TalentSync
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-slate-600">
            Free to join. No credit card needed.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
              >
                {error}
              </p>
            )}
            {/* Role */}
            <div>
              <span className="text-sm font-semibold text-slate-800">
                I want to
              </span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {ROLES.map(({ value, title, desc, Icon }) => {
                  const active = role === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRole(value)}
                      aria-pressed={active}
                      className={`relative rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-lg ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {desc}
                      </p>
                      {active && (
                        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-800"
              >
                Full name
              </label>
              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-800"
              >
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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

              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= strength ? strengthColor : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {strengthLabel} · Use 8+ characters with a mix of letters,
                    numbers and symbols
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              Your profile is shared with employers when you apply. Recruiters
              can only review applicants to their own jobs.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="p-8">
          Loading registration...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
