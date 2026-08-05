"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { User, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";

import { registerUser } from "@/app/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      alert("Registration Successful");
      router.push("/auth/login");
    },

    onError: (error) => {
      console.error(error);
      alert("Registration Failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerMutation.mutate({
      name,
      email,
      password,
      role,
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />

        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            TalentSync Platform
          </div>

          <h1 className="mt-8 text-6xl font-bold leading-tight">
            Find Talent.
            <br />
            Build Teams.
            <br />
            Grow Faster.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-200">
            Join recruiters and candidates using TalentSync to connect, hire,
            and grow careers faster than ever.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-black">Create Account</h2>

              <p className="mt-2 text-gray-700">
                Start your TalentSync journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-black">
                  Full Name
                </label>

                <div className="relative mt-2">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                  />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black placeholder:text-gray-500 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-black">
                  Email Address
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black placeholder:text-gray-500 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-black">
                  Password
                </label>

                <div className="relative mt-2">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                  />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black placeholder:text-gray-500 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-semibold text-black">
                  Account Type
                </label>

                <div className="relative mt-2">
                  <Briefcase
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                  />

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-black outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="CANDIDATE">👨‍💻 Candidate</option>

                    <option value="RECRUITER">🏢 Recruiter</option>
                  </select>
                </div>

                <p className="mt-2 text-sm text-gray-700">
                  Choose how you want to use TalentSync.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white transition duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {registerMutation.isPending ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-black">
                Already have an account?
                <button
                  onClick={() => router.push("/auth/login")}
                  className="ml-2 font-semibold text-blue-700 transition hover:text-blue-900"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
