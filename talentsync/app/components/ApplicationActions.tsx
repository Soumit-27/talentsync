"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  APPLICATION_STATUSES,
  updateApplicationStatus,
  type Application,
  type ApplicationStatus,
} from "../services/job_application";
import { scheduleInterview, updateInterview } from "../services/interview";
import {
  Field,
  ErrorState,
  Notice,
  inputClass,
  buttonClass,
  secondaryClass,
  dateTime,
} from "./ui";
function localDate(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export default function ApplicationActions({
  application,
}: {
  application: Application;
}) {
  const client = useQueryClient();
  const [status, setStatus] = useState(application.status as ApplicationStatus);
  const [scheduling, setScheduling] = useState(false);
  const [date, setDate] = useState(
    application.interview ? localDate(application.interview.scheduledAt) : "",
  );
  const [meetingLink, setMeetingLink] = useState(
    application.interview?.meetingLink ?? "",
  );
  const [notes, setNotes] = useState(application.interview?.notes ?? "");
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["recruiter-applications"] }),
      client.invalidateQueries({ queryKey: ["application", application.id] }),
      client.invalidateQueries({ queryKey: ["recruiter-interviews"] }),
    ]);
  };
  const decision = useMutation({
    mutationFn: () => updateApplicationStatus(application.id, status),
    onSuccess: refresh,
  });
  const interview = useMutation({
    mutationFn: async () => {
      const scheduledAt = new Date(date);
      if (
        Number.isNaN(scheduledAt.getTime()) ||
        scheduledAt.getTime() <= Date.now()
      )
        throw new Error("Choose a future interview date and time.");
      const payload = {
        scheduledAt: scheduledAt.toISOString(),
        meetingLink: meetingLink.trim(),
        notes: notes.trim(),
      };
      return application.interview
        ? updateInterview(application.interview.id, {
            ...payload,
            status: "SCHEDULED",
          })
        : scheduleInterview({ ...payload, applicationId: application.id });
    },
    onSuccess: async () => {
      await refresh();
      setScheduling(false);
    },
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    interview.mutate();
  };
  const busy = decision.isPending || interview.isPending;
  return (
    <div className="space-y-4">
      {decision.isError && <ErrorState error={decision.error} />}
      {decision.isSuccess && <Notice>Application status saved.</Notice>}
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <Field label="Application status">
            <select
              className={inputClass}
              value={status}
              disabled={busy}
              onChange={(event) =>
                setStatus(event.target.value as ApplicationStatus)
              }
            >
              {APPLICATION_STATUSES.map((value) => (
                <option
                  key={value}
                  value={value}
                  disabled={value === "INTERVIEW" && !application.interview}
                >
                  {value === "INTERVIEW" ? "INTERVIEW (schedule below)" : value}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <button
          disabled={busy || status === application.status}
          className={buttonClass}
          onClick={() => decision.mutate()}
        >
          {decision.isPending ? "Saving..." : "Update status"}
        </button>
      </div>
      {application.interview && (
        <p className="text-sm text-slate-500">
          Interview: {dateTime(application.interview.scheduledAt)} &middot;{" "}
          {application.interview.status.toLowerCase()}.{" "}
          <Link
            href="/interviews"
            className="font-semibold text-indigo-600 underline"
          >
            Manage interview
          </Link>
        </p>
      )}
      {!["HIRED", "REJECTED"].includes(application.status) && (
        <button
          className={secondaryClass}
          disabled={busy}
          onClick={() => setScheduling(!scheduling)}
        >
          {scheduling
            ? "Hide scheduling"
            : application.interview
              ? "Reschedule interview"
              : "Schedule interview"}
        </button>
      )}
      {scheduling && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4"
        >
          <h3 className="font-semibold text-slate-900">
            {application.interview
              ? "Update interview"
              : "Schedule a conversation"}
          </h3>
          <p className="text-xs leading-5 text-slate-500">
            The candidate will see the time and meeting link. Times are entered
            in your local timezone.
          </p>
          {interview.isError && <ErrorState error={interview.error} />}
          <fieldset disabled={busy} className="space-y-4">
            <Field label="Date and time *">
              <input
                required
                type="datetime-local"
                className={inputClass}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </Field>
            <Field label="Meeting URL (optional)">
              <input
                type="url"
                className={inputClass}
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder="https://meet.google.com/..."
              />
            </Field>
            <Field
              label="Internal recruiter notes"
              hint="These notes are not shown to the candidate."
            >
              <textarea
                className={inputClass}
                rows={3}
                maxLength={5000}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </Field>
          </fieldset>
          <button disabled={busy} className={buttonClass}>
            {interview.isPending ? "Saving interview..." : "Confirm interview"}
          </button>
        </form>
      )}
    </div>
  );
}
