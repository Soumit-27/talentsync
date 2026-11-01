// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { User, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";

// import { registerUser } from "@/app/services/auth";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("CANDIDATE");

//   const registerMutation = useMutation({
//     mutationFn: registerUser,

//     onSuccess: () => {
//       alert("Registration Successful");
//       router.push("/auth/login");
//     },

//     onError: (error) => {
//       console.error(error);
//       alert("Registration Failed");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     registerMutation.mutate({
//       name,
//       email,
//       password,
//       role,
//     });
//   };

//   return (
//     <div className="min-h-screen flex bg-slate-950">
//       {/* LEFT SECTION */}
//       <div className="hidden lg:flex flex-1 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />

//         <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

//         <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

//         <div className="relative z-10 flex flex-col justify-center px-16 text-white">
//           <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
//             TalentSync Platform
//           </div>

//           <h1 className="mt-8 text-6xl font-bold leading-tight">
//             Find Talent.
//             <br />
//             Build Teams.
//             <br />
//             Grow Faster.
//           </h1>

//           <p className="mt-6 max-w-lg text-lg text-slate-200">
//             Join recruiters and candidates using TalentSync to connect, hire,
//             and grow careers faster than ever.
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="flex flex-1 items-center justify-center p-6">
//         <div className="w-full max-w-md">
//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
//             {/* Header */}
//             <div className="mb-8 text-center">
//               <h2 className="text-4xl font-bold text-black">Create Account</h2>

//               <p className="mt-2 text-gray-700">
//                 Start your TalentSync journey
//               </p>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Name */}
//               <div>
//                 <label className="text-sm font-semibold text-black">
//                   Full Name
//                 </label>

//                 <div className="relative mt-2">
//                   <User
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
//                   />

//                   <input
//                     type="text"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="John Doe"
//                     className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black placeholder:text-gray-500 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="text-sm font-semibold text-black">
//                   Email Address
//                 </label>

//                 <div className="relative mt-2">
//                   <Mail
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
//                   />

//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="john@example.com"
//                     className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black placeholder:text-gray-500 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="text-sm font-semibold text-black">
//                   Password
//                 </label>

//                 <div className="relative mt-2">
//                   <Lock
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
//                   />

//                   <input
//                     type="password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black placeholder:text-gray-500 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="text-sm font-semibold text-black">
//                   Account Type
//                 </label>

//                 <div className="relative mt-2">
//                   <Briefcase
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
//                   />

//                   <select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
//                   >
//                     <option value="CANDIDATE">👨‍💻 Candidate</option>

//                     <option value="RECRUITER">🏢 Recruiter</option>
//                   </select>
//                 </div>

//                 <p className="mt-2 text-sm text-gray-700">
//                   Choose how you want to use TalentSync.
//                 </p>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white transition duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {registerMutation.isPending ? (
//                   "Creating Account..."
//                 ) : (
//                   <>
//                     Create Account
//                     <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="mt-8 text-center">
//               <p className="text-sm text-black">
//                 Already have an account?
//                 <button
//                   onClick={() => router.push("/auth/login")}
//                   className="ml-2 font-semibold text-blue-700 transition hover:text-blue-900"
//                 >
//                   Login
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle,
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
  "Track every application in real time",
  "Verified companies across India",
];

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password, role });
  };

  const strength = Math.min(
    4,
    (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0)
  );
  const strengthLabel = ["Too weak", "Weak", "Okay", "Good", "Strong"][strength];
  const strengthColor = [
    "bg-slate-200",
    "bg-rose-400",
    "bg-amber-400",
    "bg-lime-500",
    "bg-emerald-500",
  ][strength];

  return (
    <div className={`${font.className} min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-white antialiased`}>
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
              Join thousands of professionals and hiring teams using TalentSync
              to connect faster.
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
              &ldquo;I created my profile on Monday and had two interviews lined
              up by Friday. It really is that quick.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 font-bold">
                A
              </span>
              <div>
                <p className="text-sm font-semibold">Ananya Sharma</p>
                <p className="text-xs text-indigo-200">Frontend Developer, Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden w-fit">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white">
              T
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">TalentSync</span>
          </Link>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-slate-600">
            Free to join. No credit card needed.
          </p>

          {registerMutation.isError && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>
                We couldn&apos;t create your account. Please check your details and try again.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Role */}
            <div>
              <span className="text-sm font-semibold text-slate-800">I want to</span>
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
                          active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">{desc}</p>
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
              <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                Full name
              </label>
              <div className="relative mt-2">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
              <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                Email address
              </label>
              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
              <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                Password
              </label>
              <div className="relative mt-2">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
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
                    {strengthLabel} · Use 8+ characters with a mix of letters, numbers and symbols
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
              By signing up you agree to our{" "}
              <Link href="/terms" className="font-medium text-slate-700 underline-offset-2 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-slate-700 underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}