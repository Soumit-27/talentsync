"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Search, RefreshCw, CalendarDays } from "lucide-react";
import { useSession } from "./ProtectedRoute";
import { getAllJobs } from "../services/jobpost";
import { getMyApplications, applyForJob } from "../services/job_application";
import { getMyInterviews } from "../services/interview";
import JobCard from "./JobCard";
import {
  Page,
  PageTitle,
  Loading,
  ErrorState,
  EmptyState,
  Notice,
  Status,
  dateTime,
  cardClass,
  inputClass,
  buttonClass,
  secondaryClass,
} from "./ui";
export default function CandidateWorkspace() {
  const user = useSession();
  const pathname = usePathname();
  const client = useQueryClient();
  const tab =
    pathname === "/candidate/applications"
      ? "applications"
      : pathname === "/candidate/interviews"
        ? "interviews"
        : "jobs";
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: getAllJobs,
    enabled: tab === "jobs",
  });
  const applications = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
    refetchInterval: 30000,
  });
  const interviews = useQuery({
    queryKey: ["my-interviews"],
    queryFn: getMyInterviews,
    enabled: tab === "interviews",
    refetchInterval: 30000,
  });
  const apply = useMutation({
    mutationFn: applyForJob,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["my-applications"] });
      setConfirm(null);
      setSuccess(
        "Application submitted. You can follow its progress in My applications.",
      );
    },
    onError: async () => {
      await client.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
  const myApplications = applications.data?.data ?? [];
  const applied = new Set(
    myApplications.map((application) => application.jobId),
  );
  const filteredJobs = (jobs.data?.data ?? []).filter(
    (job) =>
      (!jobType || job.jobType === jobType) &&
      (
        job.title +
        " " +
        job.companyName +
        " " +
        job.location +
        " " +
        job.skills.join(" ")
      )
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const filteredApplications = myApplications.filter(
    (application) =>
      (!status || application.status === status) &&
      (application.job.title + " " + application.job.companyName)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const title =
    tab === "applications"
      ? "Every application, one clear picture."
      : tab === "interviews"
        ? "Your next conversation starts here."
        : "Find your next opportunity.";
  return (
    <Page>
      <PageTitle
        eyebrow={"Welcome, " + user.name.split(" ")[0]}
        title={title}
        description={
          tab === "jobs"
            ? "Explore open roles and internships. Your profile goes with every application."
            : tab === "applications"
              ? "Track recruiter decisions and interview details. This page refreshes automatically every 30 seconds."
              : "Keep track of scheduled interviews and join your next meeting."
        }
        action={
          <Link href="/candidate/profile" className={secondaryClass}>
            Edit profile <ArrowRight size={16} />
          </Link>
        }
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Applications", value: myApplications.length },
          {
            label: "In progress",
            value: myApplications.filter((item) =>
              ["SCREENING", "SHORTLISTED", "INTERVIEW"].includes(item.status),
            ).length,
          },
          {
            label: "Hired",
            value: myApplications.filter((item) => item.status === "HIRED")
              .length,
          },
        ].map((stat) => (
          <div key={stat.label} className={cardClass}>
            <p className="text-2xl font-bold text-slate-900">
              {applications.isPending ? "-" : stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      {success && (
        <Notice>
          {success}{" "}
          <Link
            href="/candidate/applications"
            className="font-semibold underline"
          >
            View applications
          </Link>
        </Notice>
      )}
      {apply.isError && <ErrorState error={apply.error} />}
      {applications.isError && (
        <ErrorState
          error={applications.error}
          retry={() => void applications.refetch()}
        />
      )}
      {tab !== "interviews" && (
        <div className="flex flex-wrap gap-3">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search {tab}</span>
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={inputClass + " pl-10"}
              placeholder={
                tab === "jobs"
                  ? "Search by role, skill, company, or location"
                  : "Search your applications"
              }
            />
          </label>
          {tab === "jobs" ? (
            <select
              aria-label="Job type"
              className={inputClass + " sm:w-48"}
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
            >
              <option value="">All job types</option>
              {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map(
                (value) => (
                  <option key={value} value={value}>
                    {value.replaceAll("_", " ")}
                  </option>
                ),
              )}
            </select>
          ) : (
            <select
              aria-label="Application status"
              className={inputClass + " sm:w-48"}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {[
                "APPLIED",
                "SCREENING",
                "SHORTLISTED",
                "INTERVIEW",
                "HIRED",
                "REJECTED",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          )}
        </div>
      )}
      {tab === "jobs" && (
        <>
          {jobs.isPending ? (
            <Loading text="Finding open opportunities..." />
          ) : jobs.isError ? (
            <ErrorState error={jobs.error} retry={() => void jobs.refetch()} />
          ) : filteredJobs.length === 0 ? (
            <EmptyState title="No matching opportunities yet">
              Try another search or return soon. New roles will appear here when
              employers publish them.
            </EmptyState>
          ) : (
            <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  action={
                    applied.has(job.id) ? (
                      <p className="text-sm font-semibold text-emerald-700">
                        Applied - Track in My applications
                      </p>
                    ) : confirm === job.id ? (
                      <div className="space-y-3 rounded-xl bg-indigo-50 p-4">
                        <p className="text-sm text-indigo-900">
                          Apply to {job.title} with your current profile?
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={apply.isPending}
                            className={buttonClass}
                            onClick={() => apply.mutate({ jobId: job.id })}
                          >
                            {apply.isPending
                              ? "Submitting..."
                              : "Confirm application"}
                          </button>
                          <button
                            disabled={apply.isPending}
                            className={secondaryClass}
                            onClick={() => setConfirm(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled={
                          apply.isPending ||
                          applications.isPending ||
                          applications.isError
                        }
                        className={buttonClass + " w-full"}
                        onClick={() => {
                          apply.reset();
                          setConfirm(job.id);
                        }}
                      >
                        Apply for this role <ArrowRight size={16} />
                      </button>
                    )
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
      {tab === "applications" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredApplications.length} applications
            </p>
            <button
              className={secondaryClass}
              disabled={applications.isFetching}
              onClick={() => void applications.refetch()}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
          {applications.isPending ? (
            <Loading />
          ) : (
            !applications.isError &&
            (filteredApplications.length === 0 ? (
              <EmptyState
                title="Your next chapter is waiting"
                action={
                  <Link href="/candidateDashboard" className={buttonClass}>
                    Explore jobs
                  </Link>
                }
              >
                Applications you submit will appear here with their latest
                status.
              </EmptyState>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <article key={application.id} className={cardClass}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {application.job.companyName}
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          {application.job.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          {application.job.location} &middot; Applied{" "}
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Status value={application.status} />
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      {application.status === "APPLIED"
                        ? "Your application has been sent to the recruiter."
                        : application.status === "HIRED"
                          ? "Congratulations! The recruiter has marked your application as hired."
                          : application.status === "REJECTED"
                            ? "The recruiter is not moving forward with this application. You can continue exploring other opportunities."
                            : "Your application is being considered. Check back here for updates."}
                    </p>
                    {application.interview && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                        <p className="font-semibold text-slate-700">
                          Interview &middot;{" "}
                          {dateTime(application.interview.scheduledAt)}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <Status value={application.interview.status} />
                          {application.interview.meetingLink &&
                            application.interview.status === "SCHEDULED" && (
                              <a
                                href={application.interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-indigo-600 underline"
                              >
                                Join meeting
                              </a>
                            )}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ))
          )}
        </>
      )}
      {tab === "interviews" && (
        <>
          {interviews.isPending ? (
            <Loading />
          ) : interviews.isError ? (
            <ErrorState
              error={interviews.error}
              retry={() => void interviews.refetch()}
            />
          ) : interviews.data.data.length === 0 ? (
            <EmptyState title="No interviews scheduled yet">
              When a recruiter schedules an interview, the date and meeting link
              will appear here.
            </EmptyState>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {interviews.data.data.map((interview) => (
                <article key={interview.id} className={cardClass}>
                  <div className="flex items-center justify-between">
                    <CalendarDays className="text-indigo-600" />
                    <Status value={interview.status} />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    {interview.application.job.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {interview.application.job.companyName}
                  </p>
                  <p className="mt-4 font-semibold text-slate-700">
                    {dateTime(interview.scheduledAt)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Times are shown in your local timezone.
                  </p>
                  {interview.meetingLink &&
                    interview.status === "SCHEDULED" && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass + " mt-5"}
                      >
                        Join interview <ArrowRight size={16} />
                      </a>
                    )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </Page>
  );
}
