import type { ReactNode } from "react";
import { errorMessage } from "../services/api";
export const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100";
export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50";
export const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-7 sm:px-8 sm:py-10">
      {children}
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}
export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-48 items-center justify-center gap-3 p-8 text-slate-500"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      {text}
    </div>
  );
}
export function ErrorState({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"
    >
      <p>{errorMessage(error)}</p>
      {retry && (
        <button
          type="button"
          className="mt-3 font-semibold underline"
          onClick={retry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
    >
      {children}
    </p>
  );
}
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={cardClass + " py-14 text-center"}>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {children}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function Status({ value }: { value: string }) {
  const color = ["OPEN", "HIRED", "COMPLETED"].includes(value)
    ? "bg-emerald-50 text-emerald-700"
    : ["REJECTED", "CANCELLED", "CLOSED"].includes(value)
      ? "bg-slate-100 text-slate-600"
      : "bg-indigo-50 text-indigo-700";
  return (
    <span
      className={
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold " + color
      }
    >
      {value.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && (
        <span className="block text-xs leading-5 text-slate-500">{hint}</span>
      )}
    </label>
  );
}
export const dateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
export const salaryLabel = (salary?: number | null) =>
  salary == null
    ? "Salary not specified"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(salary) + " / year";
