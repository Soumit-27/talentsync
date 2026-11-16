import type { ReactNode } from "react";
import type { Job } from "../services/jobpost";
import { MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import { cardClass, salaryLabel, Status } from "./ui";
export default function JobCard({
  job,
  action,
}: {
  job: Job;
  action?: ReactNode;
}) {
  return (
    <article className={cardClass + " flex flex-col"}>
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
          {job.companyName.slice(0, 1).toUpperCase()}
        </div>
        <Status value={job.jobType} />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {job.companyName}
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
        {job.title}
      </h2>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={14} />
          {job.experience ? job.experience + "+ years" : "Freshers welcome"}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700">
        {salaryLabel(job.salary)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
      <details className="mt-5 text-sm">
        <summary className="flex cursor-pointer list-none items-center gap-1 font-semibold text-indigo-600">
          View role details <ArrowUpRight size={15} />
        </summary>
        <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
          {job.description}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </p>
      </details>
      <div className="mt-auto pt-6">{action}</div>
    </article>
  );
}
