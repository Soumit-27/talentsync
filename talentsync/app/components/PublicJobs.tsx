"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getAllJobs } from "../services/jobpost";
import JobCard from "./JobCard";
import {
  Page,
  PageTitle,
  Loading,
  ErrorState,
  EmptyState,
  inputClass,
  buttonClass,
  secondaryClass,
} from "./ui";
export function FeaturedJobs() {
  const query = useQuery({ queryKey: ["jobs"], queryFn: getAllJobs });
  if (query.isPending)
    return <Loading text="Loading current opportunities..." />;
  if (query.isError)
    return (
      <ErrorState error={query.error} retry={() => void query.refetch()} />
    );
  if (!query.data.data.length)
    return (
      <EmptyState
        title="New opportunities are on their way"
        action={
          <Link href="/auth/register" className={buttonClass}>
            Create your student profile
          </Link>
        }
      >
        Create a profile now so you are ready to apply when employers publish
        jobs and internships.
      </EmptyState>
    );
  return (
    <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
      {query.data.data.slice(0, 6).map((job) => (
        <JobCard
          key={job.id}
          job={job}
          action={
            <Link
              href="/candidateDashboard"
              className={buttonClass + " w-full"}
            >
              Apply for this role <ArrowRight size={15} />
            </Link>
          }
        />
      ))}
    </div>
  );
}
function PublicJobsContent() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [type, setType] = useState("");
  const query = useQuery({ queryKey: ["jobs"], queryFn: getAllJobs });
  const jobs = (query.data?.data ?? []).filter(
    (job) =>
      (!type || job.jobType === type) &&
      job.location.toLowerCase().includes(location.toLowerCase()) &&
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
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Page>
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={secondaryClass}>
            <ArrowLeft size={16} />
            TalentSync
          </Link>
          <div className="flex gap-3">
            <Link href="/auth/login" className={secondaryClass}>
              Log in
            </Link>
            <Link href="/auth/register" className={buttonClass}>
              Create account
            </Link>
          </div>
        </nav>
        <PageTitle
          eyebrow="Open opportunities"
          title="Your next chapter is out there."
          description="Browse real jobs and internships. Create a student profile to apply and track your progress."
        />
        <div className="flex flex-wrap gap-3">
          <input
            aria-label="Search jobs"
            className={inputClass + " sm:flex-1"}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search roles, skills, companies, or locations"
          />
          <input
            aria-label="Job location"
            className={inputClass + " sm:w-48"}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City or remote"
          />
          <select
            aria-label="Job type"
            className={inputClass + " sm:w-48"}
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">All types</option>
            {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map(
              (value) => (
                <option key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </option>
              ),
            )}
          </select>
        </div>
        {query.isPending ? (
          <Loading />
        ) : query.isError ? (
          <ErrorState error={query.error} retry={() => void query.refetch()} />
        ) : !jobs.length ? (
          <EmptyState title="No matching jobs yet">
            Try another search, or check back as new employers publish
            opportunities.
          </EmptyState>
        ) : (
          <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                action={
                  <Link
                    href="/candidateDashboard"
                    className={buttonClass + " w-full"}
                  >
                    Apply for this role <ArrowRight size={15} />
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </Page>
    </div>
  );
}

export default function PublicJobs() {
  return (
    <Suspense fallback={<Loading />}>
      <PublicJobsContent />
    </Suspense>
  );
}
