
"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, MapPin, Briefcase, Clock, ExternalLink } from "lucide-react";
import { getRecruiterInterviews } from "../services/interview";

export default function InterviewsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recruiter-interviews"],
    queryFn: getRecruiterInterviews,
  });

  const interviews = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-8 text-slate-600">
        Loading interviews...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-600">
        Failed to load interviews. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Interviews
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your scheduled candidate interviews.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <CalendarCheck size={26} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Total Interviews
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {interviews.length}
              </p>
            </div>
          </div>
        </div>

        {/* Interview List */}
        {interviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarCheck
              size={42}
              className="mx-auto mb-4 text-slate-400"
            />
            <h2 className="text-lg font-semibold text-slate-800">
              No interviews scheduled
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your scheduled interviews will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {interviews.map((interview) => {
              const application = interview.application;
              const job = application.job;
              const candidate = application.candidate;
              const scheduledDate = new Date(
                interview.scheduledAt
              );

              return (
                <div
                  key={interview.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Candidate */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {candidate.user.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {candidate.user.email}
                      </p>
                      <p className="mt-2 text-sm font-medium text-blue-600">
                        {candidate.title || "Candidate"}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {interview.status}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    {/* Job */}
                    <div className="flex items-start gap-3">
                      <Briefcase
                        size={18}
                        className="mt-0.5 text-slate-400"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">
                          {job.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {job.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin size={18} className="text-slate-400" />
                      {job.location}
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Clock size={18} className="mt-0.5 text-slate-400" />
                      <div>
                        <p>
                          {scheduledDate.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p>
                          {scheduledDate.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Kolkata",
                          })} IST
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {interview.notes && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Notes:{" "}
                        </span>
                        {interview.notes}
                      </div>
                    )}
                  </div>

                  {/* Meeting Link */}
                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Join Interview
                      <ExternalLink size={17} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}