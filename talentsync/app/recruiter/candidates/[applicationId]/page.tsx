
"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRecruiterApplications, Application } from "@/app/services/job_application";

export default function CandidateDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.applicationId as string;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recruiter-applications"],
    queryFn: getRecruiterApplications,
  });

  const application: Application | undefined = useMemo(
    () =>
      data?.data?.find(
        (item: Application) => item.id === applicationId
      ),
    [data, applicationId]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-32 rounded-2xl bg-white" />
          <div className="h-64 rounded-2xl bg-white" />
          <div className="h-64 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Failed to load candidate
        </h2>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          Candidate not found
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const candidate = application.candidate;
  const user = candidate?.user;
  const job = application.job;

  const name = user?.name || "Unknown Candidate";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStyles: Record<string, string> = {
    APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
    SCREENING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    SHORTLISTED: "bg-green-50 text-green-700 border-green-200",
    INTERVIEW: "bg-purple-50 text-purple-700 border-purple-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const Detail = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value !== undefined && value !== null && value !== ""
          ? value
          : "Not provided"}
      </p>
    </div>
  );

  const SocialLink = ({
    label,
    url,
  }: {
    label: string;
    url?: string | null;
  }) => (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      {url ? (
        <a
          href={url.startsWith("http") ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block break-all text-sm font-semibold text-blue-600 hover:underline"
        >
          Visit {label}
        </a>
      ) : (
        <p className="mt-1 text-sm text-slate-400">
          Not provided
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <span>←</span> Back to Candidates
            </button>

            <h1 className="text-2xl font-bold text-slate-900">
              Candidate Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Complete candidate information and application details.
            </p>
          </div>

          <span
            className={`rounded-full border px-4 py-2 text-xs font-bold ${
              statusStyles[application.status] ||
              "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            {application.status}
          </span>
        </div>

        {/* Profile Header */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-700" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                {candidate?.imageUrl ? (
                  <img
                    src={candidate.imageUrl}
                    alt={name}
                    className="h-24 w-24 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-md">
                    {initials}
                  </div>
                )}

                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {candidate?.title || "Professional"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {candidate?.currentCompany || "Company not provided"}
                    {" · "}
                    {candidate?.location || "Location not provided"}
                  </p>
                </div>
              </div>

              {candidate?.resumeUrl && (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <span>↗</span> View Resume
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Application Information */}
        <Section title="Application Information" icon="📋">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Applied For" value={job?.title} />
            <Detail label="Company" value={job?.companyName} />
            <Detail label="Job Location" value={job?.location} />
            <Detail label="Job Type" value={job?.jobType?.replace("_", " ")} />
            <Detail
              label="Application Status"
              value={application.status}
            />
            <Detail
              label="Applied Date"
              value={formatDate(application.appliedAt)}
            />
            <Detail
              label="Last Updated"
              value={formatDate(application.updatedAt)}
            />
            <Detail
              label="Application ID"
              value={application.id}
            />
          </div>
        </Section>

        {/* Personal Information */}
        <Section title="Personal Information" icon="👤">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Full Name" value={user?.name} />
            <Detail label="Email Address" value={user?.email} />
            <Detail label="Phone Number" value={candidate?.phone} />
            <Detail label="Current Location" value={candidate?.location} />
            <Detail
              label="Preferred Location"
              value={candidate?.preferredLocation}
            />
            <Detail label="Candidate ID" value={candidate?.id} />
          </div>
        </Section>

        {/* Professional Information */}
        <Section title="Professional Information" icon="💼">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Professional Title" value={candidate?.title} />
            <Detail
              label="Total Experience"
              value={
                candidate?.experience !== undefined
                  ? `${candidate.experience} Years`
                  : undefined
              }
            />
            <Detail
              label="Current Company"
              value={candidate?.currentCompany}
            />
            <Detail
              label="Notice Period"
              value={candidate?.noticePeriod}
            />
            <Detail
              label="Current Salary"
              value={
                candidate?.currentSalary
                  ? `₹${candidate.currentSalary} LPA`
                  : "Not provided"
              }
            />
            <Detail
              label="Expected Salary"
              value={
                candidate?.expectedSalary
                  ? `₹${candidate.expectedSalary} LPA`
                  : "Not provided"
              }
            />
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6">
            <Detail
              label="About Candidate"
              value={candidate?.about || "No description provided."}
            />
          </div>
        </Section>

        {/* Social Profiles */}
        <Section title="Social & Professional Links" icon="🔗">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SocialLink
              label="GitHub"
              url={candidate?.github}
            />
            <SocialLink
              label="LinkedIn"
              url={candidate?.linkedin}
            />
            <SocialLink
              label="Portfolio"
              url={candidate?.portfolio}
            />
          </div>
        </Section>

        {/* Resume */}
        <Section title="Resume & Documents" icon="📄">
          {candidate?.resumeUrl ? (
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                  📕
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    Candidate Resume
                  </p>
                  <p className="text-xs text-slate-500">
                    Uploaded resume document
                  </p>
                </div>
              </div>

              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Open Resume ↗
              </a>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No resume uploaded by this candidate.
            </p>
          )}
        </Section>

        {/* Account Information */}
        <Section title="Account Information" icon="⚙️">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="User ID" value={user?.id} />
            <Detail
              label="Profile Created"
              value={formatDate(user?.createdAt)}
            />
            <Detail
              label="Profile Updated"
              value={formatDate(candidate?.updatedAt)}
            />
          </div>
        </Section>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            ← Back to Candidates
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
