
"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "../services/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token from email URL
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        password,
        confirmPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
            T
          </div>

          <span className="text-white text-2xl font-bold">
            Talent<span className="text-indigo-400">Sync</span>
          </span>
        </Link>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl">

          {!token ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-3">
                Invalid Reset Link
              </h1>

              <p className="text-slate-400 text-sm mb-6">
                Your reset link is missing or invalid. Please request a new one.
              </p>

              <Link
                href="/forgot-password"
                className="block bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 font-semibold"
              >
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-5">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-4xl text-emerald-400">
                ✓
              </div>

              <h1 className="text-2xl font-bold text-white mb-3">
                Password Reset Successful!
              </h1>

              <p className="text-slate-400 text-sm">
                Your password has been updated successfully.
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-3xl">
                  🔐
                </div>

                <h1 className="text-3xl font-bold text-white">
                  Create New Password
                </h1>

                <p className="text-slate-400 text-sm mt-3 leading-6">
                  Enter your new password below to secure your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 pr-16 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-indigo-400"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 pr-16 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-indigo-400"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  {loading ? "Updating Password..." : "Reset Password"}
                </button>

              </form>
            </>
          )}

          <div className="mt-7 pt-6 border-t border-slate-800 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-slate-400 hover:text-white transition"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-7">
          © {new Date().getFullYear()} TalentSync. All rights reserved.
        </p>

      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
