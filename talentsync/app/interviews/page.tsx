"use client";
import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { getRecruiterInterviews, updateInterview } from "../services/interview";
import {
  Page,
  PageTitle,
  Loading,
  ErrorState,
  EmptyState,
  Status,
  Notice,
  dateTime,
  cardClass,
  buttonClass,
  secondaryClass,
  inputClass,
} from "../components/ui";
export default function InterviewsPage() {
  const client = useQueryClient();
  const [filter, setFilter] = useState("");
  const query = useQuery({
    queryKey: ["recruiter-interviews"],
    queryFn: getRecruiterInterviews,
    refetchInterval: 30000,
  });
  const change = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "COMPLETED" | "CANCELLED";
    }) => updateInterview(id, { status }),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["recruiter-interviews"] }),
        client.invalidateQueries({ queryKey: ["recruiter-applications"] }),
        client.invalidateQueries({ queryKey: ["application"] }),
      ]);
    },
  });
  const interviews = (query.data?.data ?? []).filter(
    (item) => !filter || item.status === filter,
  );
  return (
    <Page>
      <PageTitle
        eyebrow="Interviews"
        title="Good conversations lead to great hires."
        description="Join meetings, reschedule from the candidate application, and keep interview outcomes up to date. All times use your local timezone."
        action={
          <Link href="/candidates" className={secondaryClass}>
            Schedule from candidates
          </Link>
        }
      />
      {change.isError && <ErrorState error={change.error} />}
      {change.isSuccess && (
        <Notice>
          Interview updated. The candidate can see the latest details.
        </Notice>
      )}
      <select
        aria-label="Interview status"
        className={inputClass + " sm:max-w-xs"}
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="">All interviews</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : interviews.length === 0 ? (
        <EmptyState title="No interviews to show">
          Schedule an interview from a candidate application, or change your
          filter to see past interviews.
        </EmptyState>
      ) : (
        <div className="grid items-start gap-5 xl:grid-cols-2">
          {interviews.map((interview) => (
            <article key={interview.id} className={cardClass}>
              <div className="flex items-center justify-between">
                <CalendarDays className="text-indigo-600" />
                <Status value={interview.status} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">
                {interview.application.candidate.user.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {interview.application.job.title}
              </p>
              <p className="mt-4 font-semibold text-slate-800">
                {dateTime(interview.scheduledAt)}
              </p>
              {interview.notes && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-400">
                    INTERNAL NOTES
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                    {interview.notes}
                  </p>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                {interview.meetingLink && interview.status === "SCHEDULED" && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass}
                  >
                    Join meeting <ArrowUpRight size={15} />
                  </a>
                )}
                <Link
                  href={"/recruiter/candidates/" + interview.applicationId}
                  className={secondaryClass}
                >
                  View / reschedule
                </Link>
                {interview.status === "SCHEDULED" && (
                  <>
                    <button
                      className={secondaryClass}
                      disabled={change.isPending}
                      onClick={() =>
                        change.mutate({ id: interview.id, status: "COMPLETED" })
                      }
                    >
                      Mark completed
                    </button>
                    <button
                      className="px-3 py-2 text-sm font-semibold text-rose-600"
                      disabled={change.isPending}
                      onClick={() =>
                        change.mutate({ id: interview.id, status: "CANCELLED" })
                      }
                    >
                      Cancel interview
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Page>
  );
}
