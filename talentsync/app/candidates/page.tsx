"use client";

import { useMemo, useState, type FormEvent } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {

  getRecruiterApplications,

  Application,

} from "../services/job_application";

import { scheduleInterview } from "../services/interview";

export default function RecruiterCandidatesPage() {

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [jobFilter, setJobFilter] = useState("ALL");

  // Interview scheduling state
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("16:30");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");

  const scheduleMutation = useMutation({
    mutationFn: scheduleInterview,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recruiter-interviews"] }),
        queryClient.invalidateQueries({ queryKey: ["recruiter-applications"] }),
      ]);
      setSelectedApplication(null);
      setScheduledDate("");
      setScheduledTime("16:30");
      setMeetingLink("");
      setNotes("");
      alert("Interview scheduled successfully!");
    },
    onError: (error) => {
      console.error("Failed to schedule interview:", error);
      alert("Failed to schedule interview. Please try again.");
    },
  });

  const handleScheduleInterview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedApplication || !scheduledDate || !scheduledTime) return;

    const localDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (Number.isNaN(localDateTime.getTime())) {
      alert("Please select a valid date and time.");
      return;
    }

    if (localDateTime.getTime() <= Date.now()) {
      alert("Please select a future interview date and time.");
      return;
    }

    scheduleMutation.mutate({
      applicationId: selectedApplication.id,
      scheduledAt: localDateTime.toISOString(),
      meetingLink: meetingLink.trim(),
      notes: notes.trim(),
    });
  };

  const {

    data,

    isLoading,

    isError,

    refetch,

  } = useQuery({

    queryKey: ["recruiter-applications"],

    queryFn: getRecruiterApplications,

  });

  const applications: Application[] = data?.data ?? [];

  // ----------------------------------------

  // Jobs for filter

  // ----------------------------------------

  const jobs = useMemo(() => {

    const map = new Map<string, string>();

    applications.forEach((application) => {

      map.set(application.job.id, application.job.title);

    });

    return Array.from(map.entries());

  }, [applications]);

  // ----------------------------------------

  // Statistics

  // ----------------------------------------

  const totalCandidates = applications.length;

  const appliedCount = applications.filter(

    (item) => item.status === "APPLIED"

  ).length;

  const screeningCount = applications.filter(

    (item) => item.status === "SCREENING"

  ).length;

  const shortlistedCount = applications.filter(

    (item) => item.status === "SHORTLISTED"

  ).length;

  const interviewCount = applications.filter(

    (item) => item.status === "INTERVIEW"

  ).length;

  // ----------------------------------------

  // Filter

  // ----------------------------------------

  const filteredApplications = useMemo(() => {

    return applications.filter((application) => {

      const candidate = application.candidate;

      const job = application.job;

      const searchText = search.toLowerCase();

      const matchesSearch =

        candidate?.user?.name

          ?.toLowerCase()

          .includes(searchText) ||

        candidate?.user?.email

          ?.toLowerCase()

          .includes(searchText) ||

        candidate?.title

          ?.toLowerCase()

          .includes(searchText) ||

        candidate?.currentCompany

          ?.toLowerCase()

          .includes(searchText) ||

        job.title

          ?.toLowerCase()

          .includes(searchText);

      const matchesStatus =

        statusFilter === "ALL" ||

        application.status === statusFilter;

      const matchesJob =

        jobFilter === "ALL" ||

        application.job.id === jobFilter;

      return (

        matchesSearch &&

        matchesStatus &&

        matchesJob

      );

    });

  }, [

    applications,

    search,

    statusFilter,

    jobFilter,

  ]);

  // ----------------------------------------

  // Loading

  // ----------------------------------------

  if (isLoading) {

    return (

      <div className="min-h-screen bg-[#f8fafc] p-6">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-6 h-8 w-48 rounded bg-slate-200" />

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (

              <div

                key={item}

                className="h-28 rounded-xl bg-white"

              />

            ))}

          </div>

          <div className="h-96 rounded-xl bg-white" />

        </div>

      </div>

    );

  }

  // ----------------------------------------

  // Error

  // ----------------------------------------

  if (isError) {

    return (

      <div className="min-h-screen bg-[#f8fafc] p-6">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <h2 className="font-semibold text-red-700">

              Failed to load candidates

            </h2>

            <p className="mt-1 text-sm text-red-600">

              Please try again.

            </p>

            <button

              onClick={() => refetch()}

              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"

            >

              Retry

            </button>

          </div>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================================================= */}

        {/* HEADER */}

        {/* ================================================= */}

        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">

              Candidates

            </h1>

            <p className="mt-1 text-sm text-slate-500">

              Manage and review candidates who applied to

              your jobs.

            </p>

          </div>

          <button

            onClick={() => refetch()}

            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"

          >

            <svg

              className="h-4 w-4"

              fill="none"

              stroke="currentColor"

              strokeWidth="2"

              viewBox="0 0 24 24"

            >

              <path

                strokeLinecap="round"

                strokeLinejoin="round"

                d="M4 4v5h5M20 20v-5h-5M5.07 9A7 7 0 0118.93 6M18.93 15A7 7 0 015.07 18"

              />

            </svg>

            Refresh

          </button>

        </div>

        {/* ================================================= */}

        {/* STAT CARDS */}

        {/* ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard

            title="Total Candidates"

            value={totalCandidates}

            icon="users"

          />

          <StatCard

            title="New Applications"

            value={appliedCount}

            icon="file"

          />

          <StatCard

            title="Screening"

            value={screeningCount}

            icon="search"

          />

          <StatCard

            title="Shortlisted"

            value={shortlistedCount}

            icon="check"

          />

          <StatCard

            title="Interviews"

            value={interviewCount}

            icon="calendar"

          />

        </div>

        {/* ================================================= */}

        {/* MAIN CARD */}

        {/* ================================================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* ----------------------------------------------- */}

          {/* TOOLBAR */}

          {/* ----------------------------------------------- */}

          <div className="border-b border-slate-200 p-4">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

              {/* Search */}

              <div className="relative flex-1">

                <svg

                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"

                  fill="none"

                  stroke="currentColor"

                  strokeWidth="2"

                  viewBox="0 0 24 24"

                >

                  <circle

                    cx="11"

                    cy="11"

                    r="7"

                  />

                  <path

                    strokeLinecap="round"

                    d="m20 20-3.5-3.5"

                  />

                </svg>

                <input

                  value={search}

                  onChange={(e) =>

                    setSearch(e.target.value)

                  }

                  placeholder="Search candidates, email, job..."

                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"

                />

              </div>

              {/* Status */}

              <select

                value={statusFilter}

                onChange={(e) =>

                  setStatusFilter(e.target.value)

                }

                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"

              >

                <option value="ALL">

                  All Status

                </option>

                <option value="APPLIED">

                  Applied

                </option>

                <option value="SCREENING">

                  Screening

                </option>

                <option value="SHORTLISTED">

                  Shortlisted

                </option>

                <option value="INTERVIEW">

                  Interview

                </option>

                <option value="REJECTED">

                  Rejected

                </option>

                <option value="HIRED">

                  Hired

                </option>

              </select>

              {/* Job */}

              <select

                value={jobFilter}

                onChange={(e) =>

                  setJobFilter(e.target.value)

                }

                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"

              >

                <option value="ALL">

                  All Jobs

                </option>

                {jobs.map(([id, title]) => (

                  <option

                    key={id}

                    value={id}

                  >

                    {title}

                  </option>

                ))}

              </select>

            </div>

            {/* Result count */}

            <div className="mt-3 flex items-center justify-between">

              <p className="text-xs text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-700">

                  {filteredApplications.length}

                </span>{" "}

                of{" "}

                <span className="font-semibold text-slate-700">

                  {applications.length}

                </span>{" "}

                candidates

              </p>

              {(search ||

                statusFilter !== "ALL" ||

                jobFilter !== "ALL") && (

                <button

                  onClick={() => {

                    setSearch("");

                    setStatusFilter("ALL");

                    setJobFilter("ALL");

                  }}

                  className="text-xs font-medium text-slate-600 hover:text-slate-900"

                >

                  Clear filters

                </button>

              )}

            </div>

          </div>

          {/* ================================================= */}

          {/* TABLE */}

          {/* ================================================= */}

          {filteredApplications.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

                <svg

                  className="h-6 w-6 text-slate-400"

                  fill="none"

                  stroke="currentColor"

                  strokeWidth="1.8"

                  viewBox="0 0 24 24"

                >

                  <circle

                    cx="12"

                    cy="8"

                    r="4"

                  />

                  <path

                    strokeLinecap="round"

                    d="M4 21a8 8 0 0116 0"

                  />

                </svg>

              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">

                No candidates found

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                Try changing your search or filters.

              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200">

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Candidate

                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Applied For

                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Experience

                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Salary

                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Notice

                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Status

                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">

                      Action

                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredApplications.map(

                    (application) => {

                      const candidate =

                        application.candidate;

                      const job =

                        application.job;

                      const name =

                        candidate?.user?.name ||

                        "Unknown Candidate";

                      const initials =

                        name

                          .split(" ")

                          .map((word) =>

                            word.charAt(0)

                          )

                          .join("")

                          .slice(0, 2)

                          .toUpperCase();

                      return (

                        <tr

                          key={application.id}

                          className="group transition hover:bg-slate-50"

                        >

                          {/* Candidate */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">

                                {initials}

                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-slate-900">

                                  {name}

                                </p>

                                <p className="truncate text-xs text-slate-500">

                                  {candidate?.user?.email}

                                </p>

                                <p className="mt-0.5 truncate text-xs text-slate-400">

                                  {candidate?.title ||

                                    "Candidate"}

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Job */}

                          <td className="px-5 py-4">

                            <p className="max-w-[190px] truncate text-sm font-medium text-slate-800">

                              {job.title}

                            </p>

                            <p className="mt-1 text-xs text-slate-500">

                              {job.companyName}

                            </p>

                            <p className="mt-1 text-xs text-slate-400">

                              {job.location}

                            </p>

                          </td>

                          {/* Experience */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-medium text-slate-700">

                              {candidate?.experience ??

                                0}{" "}

                              yrs

                            </p>

                            <p className="mt-1 text-xs text-slate-400">

                              {candidate?.currentCompany ||

                                "Fresher"}

                            </p>

                          </td>

                          {/* Salary */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-medium text-slate-700">

                              {candidate?.expectedSalary

                                ? `₹${candidate.expectedSalary.toLocaleString()}`

                                : "—"}

                            </p>

                            <p className="mt-1 text-xs text-slate-400">

                              Expected

                            </p>

                          </td>

                          {/* Notice */}

                          <td className="px-5 py-4">

                            <span className="text-sm text-slate-700">

                              {candidate?.noticePeriod ||

                                "—"}

                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            <StatusBadge

                              status={

                                application.status

                              }

                            />

                          </td>

                          {/* Action */}

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApplication(application);
                                setScheduledDate("");
                                setScheduledTime("16:30");
                                setMeetingLink("");
                                setNotes("");
                              }}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                              Schedule Interview
                            </button>

                          </td>

                        </tr>

                      );

                    }

                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* ================================================= */}

          {/* FOOTER */}

          {/* ================================================= */}

          {filteredApplications.length > 0 && (

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-500">

                {filteredApplications.length} candidate

                {filteredApplications.length !== 1

                  ? "s"

                  : ""}{" "}

                found

              </p>

              <div className="flex items-center gap-2">

                <button

                  disabled

                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400"

                >

                  Previous

                </button>

                <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">

                  1

                </span>

                <button

                  disabled

                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400"

                >

                  Next

                </button>

              </div>

            </div>

          )}

        </div>

      </div>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-interview-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="schedule-interview-title" className="text-xl font-bold text-slate-900">
                  Schedule Interview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Candidate: {selectedApplication.candidate?.user?.name || "Unknown Candidate"}
                </p>
                <p className="text-sm text-slate-500">
                  Job: {selectedApplication.job.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close schedule interview form"
                className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label htmlFor="scheduledDate" className="mb-1 block text-sm font-medium text-slate-700">
                  Interview Date
                </label>
                <input
                  id="scheduledDate"
                  type="date"
                  required
                  min={new Date().toLocaleDateString("en-CA")}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="scheduledTime" className="mb-1 block text-sm font-medium text-slate-700">
                  Interview Time (IST)
                </label>
                <input
                  id="scheduledTime"
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="meetingLink" className="mb-1 block text-sm font-medium text-slate-700">
                  Google Meet Link
                </label>
                <input
                  id="meetingLink"
                  type="url"
                  required
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="interviewNotes" className="mb-1 block text-sm font-medium text-slate-700">
                  Interview Notes
                </label>
                <textarea
                  id="interviewNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Technical interview - React and Node.js"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              {scheduleMutation.isError && (
                <p role="alert" className="text-sm text-red-600">
                  Unable to schedule the interview. Please try again.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {scheduleMutation.isPending ? "Scheduling..." : "Schedule Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================================================== */
/* STAT CARD */

/* ===================================================== */

function StatCard({

  title,

  value,

  icon,

}: {

  title: string;

  value: number;

  icon: string;

}) {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-500">

          {title}

        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

          {icon === "users" && "👥"}

          {icon === "file" && "📄"}

          {icon === "search" && "🔎"}

          {icon === "check" && "✓"}

          {icon === "calendar" && "📅"}

        </div>

      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900">

        {value}

      </p>

    </div>

  );

}

/* ===================================================== */

/* STATUS BADGE */

/* ===================================================== */

function StatusBadge({

  status,

}: {

  status: string;

}) {

  const styles: Record<string, string> = {

    APPLIED:

      "bg-blue-50 text-blue-700 border-blue-100",

    SCREENING:

      "bg-yellow-50 text-yellow-700 border-yellow-100",

    SHORTLISTED:

      "bg-green-50 text-green-700 border-green-100",

    INTERVIEW:

      "bg-purple-50 text-purple-700 border-purple-100",

    REJECTED:

      "bg-red-50 text-red-700 border-red-100",

    HIRED:

      "bg-emerald-50 text-emerald-700 border-emerald-100",

  };

  return (

    <span

      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${

        styles[status] ||

        "border-slate-200 bg-slate-50 text-slate-600"

      }`}

    >

      {status}

    </span>

  );

}