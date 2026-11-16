import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-center text-slate-900">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="text-3xl font-bold">This page could not be found.</h1>
      <p className="text-slate-500">
        Return home to explore jobs or open your workspace.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
      >
        Back to TalentSync
      </Link>
    </div>
  );
}
