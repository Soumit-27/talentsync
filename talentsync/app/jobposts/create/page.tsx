"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, ArrowRight } from "lucide-react";
import {
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  type Job,
  type CreateJobPayload,
  type UpdateJobPayload,
} from "../../services/jobpost";
import { useSession } from "../../components/ProtectedRoute";
import {
  Page,
  PageTitle,
  Field,
  Loading,
  ErrorState,
  Notice,
  EmptyState,
  Status,
  inputClass,
  buttonClass,
  secondaryClass,
  cardClass,
  salaryLabel,
} from "../../components/ui";
function JobForm({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const user = useSession();
  const client = useQueryClient();
  const [form, setForm] = useState({
    title: job?.title ?? "",
    description: job?.description ?? "",
    location: job?.location ?? user.company?.location ?? "",
    salary: job?.salary == null ? "" : String(job.salary),
    experience: job?.experience == null ? "0" : String(job.experience),
    skills: job?.skills.join(", ") ?? "",
    jobType: (job?.jobType ?? "FULL_TIME") as CreateJobPayload["jobType"],
    status: (job?.status ?? "OPEN") as "OPEN" | "CLOSED",
  });
  const change = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const save = useMutation({
    mutationFn: async () => {
      const payload: CreateJobPayload = {
        title: form.title,
        description: form.description,
        location: form.location,
        companyName: user.company?.name ?? "",
        skills: [
          ...new Set(
            form.skills
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        ],
        jobType: form.jobType,
        salary: form.salary === "" ? undefined : Number(form.salary),
        experience:
          form.experience === "" ? undefined : Number(form.experience),
      };
      return job
        ? updateJob(job.id, { ...payload, status: form.status })
        : createJob(payload);
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["my-jobs"] }),
        client.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
      onClose();
    },
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save.mutate();
  };
  return (
    <form
      onSubmit={submit}
      className={cardClass + " space-y-6 border-indigo-200"}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          {job ? "Edit job post" : "Create an opportunity"}
        </h2>
        <button
          type="button"
          disabled={save.isPending}
          onClick={onClose}
          className={secondaryClass}
        >
          Cancel
        </button>
      </div>
      <p className="text-sm text-slate-500">
        Posting for{" "}
        <span className="font-semibold text-slate-800">
          {user.company?.name}
        </span>
        . New jobs are published immediately.
      </p>
      {save.isError && <ErrorState error={save.error} />}
      <fieldset disabled={save.isPending} className="grid gap-5 sm:grid-cols-2">
        <Field label="Job title *">
          <input
            className={inputClass}
            required
            minLength={3}
            maxLength={150}
            value={form.title}
            onChange={(event) => change("title", event.target.value)}
            placeholder="Frontend Developer Intern"
          />
        </Field>
        <Field label="Location *">
          <input
            className={inputClass}
            required
            minLength={2}
            maxLength={200}
            value={form.location}
            onChange={(event) => change("location", event.target.value)}
            placeholder="Remote / Bengaluru"
          />
        </Field>
        <Field label="Job type">
          <select
            className={inputClass}
            value={form.jobType}
            onChange={(event) => change("jobType", event.target.value)}
          >
            {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map(
              (value) => (
                <option key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </option>
              ),
            )}
          </select>
        </Field>
        <Field
          label="Annual salary (INR)"
          hint="Leave blank if the salary is negotiable."
        >
          <input
            className={inputClass}
            type="number"
            min="0"
            max="100000000"
            value={form.salary}
            onChange={(event) => change("salary", event.target.value)}
          />
        </Field>
        <Field
          label="Required experience (years)"
          hint="Enter 0 to welcome students and freshers."
        >
          <input
            className={inputClass}
            type="number"
            min="0"
            max="50"
            step="1"
            value={form.experience}
            onChange={(event) => change("experience", event.target.value)}
          />
        </Field>
        <Field label="Skills *" hint="Separate skills with commas.">
          <input
            className={inputClass}
            required
            value={form.skills}
            onChange={(event) => change("skills", event.target.value)}
            placeholder="React, TypeScript, CSS"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Job description *"
            hint="Include responsibilities, qualifications, work arrangements, and what candidates can expect."
          >
            <textarea
              className={inputClass}
              required
              minLength={30}
              maxLength={20000}
              rows={7}
              value={form.description}
              onChange={(event) => change("description", event.target.value)}
            />
          </Field>
        </div>
        {job && (
          <Field label="Accepting applications">
            <select
              className={inputClass}
              value={form.status}
              onChange={(event) => change("status", event.target.value)}
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </Field>
        )}
      </fieldset>
      <div className="flex justify-end">
        <button disabled={save.isPending} className={buttonClass}>
          {save.isPending ? "Saving..." : job ? "Save changes" : "Publish job"}
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
export default function JobsPage() {
  const client = useQueryClient();
  const [editing, setEditing] = useState<Job | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const jobs = useQuery({ queryKey: ["my-jobs"], queryFn: getMyJobs });
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["my-jobs"] }),
      client.invalidateQueries({ queryKey: ["jobs"] }),
      client.invalidateQueries({ queryKey: ["recruiter-applications"] }),
    ]);
  };
  const remove = useMutation({
    mutationFn: deleteJob,
    onSuccess: async () => {
      await refresh();
      setDeleting(null);
      setMessage("Job and its applications deleted.");
    },
  });
  const toggle = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: UpdateJobPayload["status"];
    }) => updateJob(id, { status }),
    onSuccess: refresh,
  });
  const filtered = (jobs.data?.data ?? []).filter(
    (job) =>
      (!status || job.status === status) &&
      (job.title + " " + job.location)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Page>
      <PageTitle
        eyebrow="Job management"
        title="Make room for your next great hire."
        description="Publish opportunities, update the details, and close applications when you are ready."
        action={
          <button
            className={buttonClass}
            onClick={() => {
              setEditing(null);
              setMessage("");
            }}
          >
            <Plus size={17} />
            Create job
          </button>
        }
      />
      {message && <Notice>{message}</Notice>}
      {editing !== undefined && (
        <JobForm
          key={editing?.id ?? "new"}
          job={editing}
          onClose={() => {
            setEditing(undefined);
          }}
        />
      )}
      {deleting && (
        <section
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-5"
        >
          <h2 className="font-bold text-rose-900">Delete {deleting.title}?</h2>
          <p className="mt-2 text-sm text-rose-800">
            This permanently deletes the job, its applications, and interviews.
            Close the job instead if you want to keep your hiring records.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              disabled={remove.isPending}
              onClick={() => remove.mutate(deleting.id)}
              className={buttonClass + " bg-rose-600 hover:bg-rose-700"}
            >
              {remove.isPending ? "Deleting..." : "Delete permanently"}
            </button>
            <button
              className={secondaryClass}
              disabled={remove.isPending}
              onClick={() => setDeleting(null)}
            >
              Keep job
            </button>
          </div>
          {remove.isError && <ErrorState error={remove.error} />}
        </section>
      )}
      {toggle.isError && <ErrorState error={toggle.error} />}
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Search your jobs"
          className={inputClass + " sm:flex-1"}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your job posts"
        />
        <select
          aria-label="Job status"
          className={inputClass + " sm:w-48"}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All jobs</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      {jobs.isPending ? (
        <Loading />
      ) : jobs.isError ? (
        <ErrorState error={jobs.error} retry={() => void jobs.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No job posts to show">
          Create your first job, or change your search to find an existing post.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <article key={job.id} className={cardClass}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h2>
                    <Status value={job.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {job.location} &middot;{" "}
                    {job.jobType.replaceAll("_", " ").toLowerCase()} &middot;{" "}
                    {salaryLabel(job.salary)}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-indigo-600">
                    {job._count?.applications ?? 0} applications
                  </p>
                </div>
                <button
                  className={secondaryClass}
                  onClick={() => {
                    setEditing(job);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                <Link
                  href={"/candidates?job=" + job.id}
                  className={secondaryClass}
                >
                  View candidates
                </Link>
                <button
                  className={secondaryClass}
                  disabled={toggle.isPending}
                  onClick={() =>
                    toggle.mutate({
                      id: job.id,
                      status: job.status === "OPEN" ? "CLOSED" : "OPEN",
                    })
                  }
                >
                  {job.status === "OPEN"
                    ? "Close applications"
                    : "Reopen applications"}
                </button>
                <button
                  className="px-3 py-2 text-sm font-semibold text-rose-600"
                  onClick={() => setDeleting(job)}
                >
                  Delete job
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Page>
  );
}
