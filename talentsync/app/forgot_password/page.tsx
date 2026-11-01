
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordLink } from "../services/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await resetPasswordLink({ email });

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Unable to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-white">
            Forgot Password?
          </h1>

          <p className="text-slate-400 mt-3 text-sm">
            Enter your registered email address. We'll send you a password reset link.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-5">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl">
              <p className="text-emerald-400 font-semibold">
                Reset link sent!
              </p>
              <p className="text-slate-400 text-sm mt-2">
                If your email is registered, check your inbox for the reset link.
              </p>
            </div>

            <button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>
        )}

        <div className="text-center mt-7">
          <Link
            href="/auth/login"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
