"use client";
import { resumeViewUrl } from "../services/resume";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import {
  getRecruiterApplications,
  APPLICATION_STATUSES,
} from "../services/job_application";
import { getMyJobs } from "../services/jobpost";
import ApplicationActions from "../components/ApplicationActions";
import {
  Page,
  PageTitle,
  Loading,
  ErrorState,
  EmptyState,
  Status,
  inputClass,
  cardClass,
  secondaryClass,
} from "../components/ui";
function Candidates() {
  const params = useSearchParams();
  const [job, setJob] = useState(params.get("job") ?? "");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const applications = useQuery({
    queryKey: ["recruiter-applications"],
    queryFn: getRecruiterApplications,
    refetchInterval: 30000,
  });
  const jobs = useQuery({ queryKey: ["my-jobs"], queryFn: getMyJobs });
  const filtered = (applications.data?.data ?? []).filter(
    (application) =>
      (!job || application.jobId === job) &&
      (!status || application.status === status) &&
      (
        (application.candidate?.user?.name ?? "") +
        " " +
        (application.candidate?.user?.email ?? "") +
        " " +
        application.job.title
      )
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Page>
      <PageTitle
        eyebrow="Candidate pipeline"
        title="Meet the people behind the applications."
        description="Review profiles, move candidates through your pipeline, and schedule interviews. Decisions are visible to students in their application tracker."
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_180px]">
        <input
          aria-label="Search candidates"
          className={inputClass}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, or role"
        />
        <select
          aria-label="Filter by job"
          className={inputClass}
          value={job}
          onChange={(event) => setJob(event.target.value)}
        >
          <option value="">All jobs</option>
          {jobs.data?.data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          className={inputClass}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      {applications.isPending ? (
        <Loading />
      ) : applications.isError ? (
        <ErrorState
          error={applications.error}
          retry={() => void applications.refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No applications to show"
          action={
            <Link href="/jobposts/create" className={secondaryClass}>
              Manage jobs
            </Link>
          }
        >
          Applications to your jobs appear here. Try changing the filters or
          share your open opportunities.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {filtered.map((application) => (
            <article key={application.id} className={cardClass}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                    {application.candidate?.user?.name.slice(0, 1) || "C"}
                  </span>
                  <div>
                    <Link
                      href={"/recruiter/candidates/" + application.id}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600"
                    >
                      {application.candidate?.user?.name || "Candidate"}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {application.candidate?.title ||
                        application.candidate?.user?.email}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Applied for {application.job.title} &middot;{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Status value={application.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={"/recruiter/candidates/" + application.id}
                  className={secondaryClass}
                >
                  View full profile <ArrowUpRight size={14} />
                </Link>
                {application.candidate?.resumeUrl && (
                  <a
                    href={resumeViewUrl(application.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={secondaryClass}
                  >
                    View resume
                  </a>
                )}
              </div>
              <details className="mt-5 border-t border-slate-100 pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-indigo-600">
                  Manage application
                </summary>
                <div className="mt-4">
                  <ApplicationActions
                    key={application.updatedAt}
                    application={application}
                  />
                </div>
              </details>
            </article>
          ))}
        </div>
      )}
    </Page>
  );
}
export default function CandidatesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Candidates />
    </Suspense>
  );
}
