"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Search, Briefcase, TrendingUp, Users, Eye, MoreHorizontal,
  X, MapPin, IndianRupee, Clock, Building2, ChevronDown, Loader2,
  Pencil, Trash2, ArrowLeft
} from "lucide-react";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  type CreateJobPayload,
  type UpdateJobPayload,
  type Job,
} from "@/app/services/jobpost";

// ─── Helpers ────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
  DRAFT: "bg-amber-50 text-amber-700 border-amber-200",
};

const TYPE_STYLES: Record<string, string> = {
  FULL_TIME: "bg-blue-50 text-blue-700",
  PART_TIME: "bg-purple-50 text-purple-700",
  CONTRACT: "bg-orange-50 text-orange-700",
  INTERNSHIP: "bg-pink-50 text-pink-700",
};

const JOB_TYPE_OPTIONS = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
] as const;

const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const formatINR = (amt?: number) => {
  if (!amt && amt !== 0) return "—";
  if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
  if (amt >= 100000) return `₹${(amt / 100000).toFixed(0)}L`;
  return `₹${amt}`;
};

const timeAgo = (iso?: string) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
};

// ─── Stats ──────────────────────────────────────────────────
function StatsBar({ jobs }: { jobs: Job[] }) {
  const stats = [
    { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Open", value: jobs.filter((j) => (j.status || "").toUpperCase() === "OPEN").length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Closed", value: jobs.filter((j) => (j.status || "").toUpperCase() === "CLOSED").length, icon: Eye, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Total Skills", value: new Set(jobs.flatMap((j) => j.skills || [])).size, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <Icon size={20} className={s.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Form state shape ────────────────────────────────────────
interface JobFormState {
  title: string;
  companyName: string;
  location: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salary: string;
  experience: string;
  description: string;
  status: "OPEN" | "CLOSED";
}

const EMPTY_FORM: JobFormState = {
  title: "",
  companyName: "",
  location: "",
  jobType: "FULL_TIME",
  salary: "",
  experience: "",
  description: "",
  status: "OPEN",
};

const jobToForm = (job: Job): JobFormState => ({
  title: job.title || "",
  companyName: job.companyName || "",
  location: job.location || "",
  jobType: (job.jobType as JobFormState["jobType"]) || "FULL_TIME",
  salary: job.salary != null ? String(job.salary) : "",
  experience: job.experience != null ? String(job.experience) : "",
  description: job.description || "",
  status: (job.status as JobFormState["status"]) === "CLOSED" ? "CLOSED" : "OPEN",
});

// ─── Job Form Panel (Create + Edit) ──────────────────────────
function JobFormPanel({
  open,
  mode,
  editingId,
  onClose,
  onDone,
}: {
  open: boolean;
  mode: "create" | "edit";
  editingId?: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<JobFormState>(EMPTY_FORM);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [formError, setFormError] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  // Fetch the job being edited so the form pre-fills
  const { data: editJob, isLoading: isLoadingJob } = useQuery({
    queryKey: ["job", editingId],
    queryFn: () => getJobById(editingId!),
    enabled: mode === "edit" && !!editingId && open,
  });

  // When the fetched job arrives, seed the form once
  if (mode === "edit" && editJob?.data && !loaded) {
    setForm(jobToForm(editJob.data));
    setSkills(editJob.data.skills || []);
    setLoaded(true);
  }

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (!skills.includes(trimmed)) setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const update = (field: keyof JobFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSkills([]);
    setSkillInput("");
    setFormError("");
    setLoaded(false);
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateJobPayload) => createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      resetForm();
      onClose();
      onDone();
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "Failed to create job.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateJobPayload) => updateJob(editingId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", editingId] });
      resetForm();
      onClose();
      onDone();
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "Failed to update job.");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) return setFormError("Job title is required.");
    if (!form.companyName.trim()) return setFormError("Company name is required.");
    if (!form.location.trim()) return setFormError("Location is required.");
    if (skills.length === 0) return setFormError("Please add at least one skill.");

    if (mode === "create") {
      const payload: CreateJobPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        companyName: form.companyName.trim(),
        location: form.location.trim(),
        salary: form.salary ? Number(form.salary) : undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        skills,
        jobType: form.jobType,
      };
      createMutation.mutate(payload);
    } else {
      const payload: UpdateJobPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        companyName: form.companyName.trim(),
        location: form.location.trim(),
        salary: form.salary ? Number(form.salary) : undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        skills,
        jobType: form.jobType,
        status: form.status,
      };
      updateMutation.mutate(payload);
    }
  };

  if (!open) return null;

  const showSpinner = mode === "edit" && isLoadingJob && !loaded;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === "create" ? "Create New Job" : "Edit Job"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {mode === "create"
                ? "Fill in the details to publish a job listing."
                : "Update the job details below."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {showSpinner ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="text-sm text-slate-500 mt-3">Loading job details…</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    placeholder="TalentSync"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Location + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Bhubaneswar"
                      className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
                  <div className="relative">
                    <select
                      value={form.jobType}
                      onChange={(e) => update("jobType", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 bg-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      {JOB_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Salary + Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary (₹/year)</label>
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={form.salary}
                      onChange={(e) => update("salary", e.target.value)}
                      placeholder="6,00,000"
                      className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience (yrs)</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={form.experience}
                      onChange={(e) => update("experience", e.target.value)}
                      placeholder="2"
                      className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Status (edit mode only) */}
              {mode === "edit" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(e) => update("status", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 bg-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Skills <span className="text-slate-400 font-normal">(press Enter to add)</span>
                </label>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-700 transition">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="React, Next.js, TypeScript"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isPending}
                className="px-5 py-2.5 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {mode === "create" ? "Publishing..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {mode === "create" ? <Plus size={16} /> : <Pencil size={16} />}
                    {mode === "create" ? "Publish Job" : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Delete Confirm Dialog ───────────────────────────────────
function DeleteConfirm({
  open,
  job,
  onClose,
}: {
  open: boolean;
  job: Job | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setError("");
      onClose();
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to delete job.");
    },
  });

  if (!open || !job) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">Delete job?</h3>
            <p className="text-sm text-slate-500 mt-1">
              You're about to delete <span className="font-medium text-slate-700">"{job.title}"</span>. This action cannot be undone.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-5 py-2.5 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(job.id)}
            disabled={deleteMutation.isPending}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Job Card ────────────────────────────────────────────────
function JobCard({
  job,
  onEdit,
  onDelete,
}: {
  job: Job;
  onEdit: (id: string) => void;
  onDelete: (job: Job) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusKey = (job.status || "").toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {(job.companyName || "?").charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition cursor-pointer">{job.title}</h3>
            <p className="text-sm text-slate-500">{job.companyName}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-36 bg-white rounded-lg border border-slate-200 shadow-lg py-1">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(job.id); }}
                  className="w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(job); }}
                  className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
          <MapPin size={12} /> {job.location}
        </span>
        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-medium ${TYPE_STYLES[job.jobType] || "bg-slate-50 text-slate-600"}`}>
          {JOB_TYPE_LABEL[job.jobType] || job.jobType}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
          <IndianRupee size={12} /> {formatINR(job.salary)}/yr
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
          <Clock size={12} /> {job.experience ?? 0} yrs exp
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(job.skills || []).map((skill) => (
          <span key={skill} className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{skill}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_STYLES[statusKey] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
          {job.status || "—"}
        </span>
        <span className="text-xs text-slate-500">{timeAgo(job.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

  // Fetch all jobs
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: getAllJobs,
  });

  const jobs: Job[] = data?.data ?? [];

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (job.title || "").toLowerCase().includes(q) ||
        (job.companyName || "").toLowerCase().includes(q) ||
        (job.skills || []).some((s) => s.toLowerCase().includes(q));
      const matchesStatus = filterStatus === "All" || (job.status || "").toUpperCase() === filterStatus.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, filterStatus]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your job postings and track applicants.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition"
          >
            <Plus size={18} />
            Create Job
          </button>
        </div>

        {/* Stats */}
        <StatsBar jobs={jobs} />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company, or skill..."
              className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-2.5 text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {["All", "Open", "Closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-2.5 text-sm font-medium rounded-lg border transition ${
                  filterStatus === status
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-4">
          {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
        </p>

        {/* Content states */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="text-sm text-slate-500 mt-3">Loading jobs…</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-xl border border-red-200 p-10 text-center">
            <p className="text-sm text-red-600 mb-1">
              {error instanceof Error ? error.message : "Failed to load jobs."}
            </p>
            <p className="text-sm text-slate-500">Please check your backend is running and the token is valid.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={(id) => setEditingId(id)}
                onDelete={(j) => setDeletingJob(j)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} className="text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">No jobs found</h3>
            <p className="text-sm text-slate-500 mb-4">
              {jobs.length === 0 ? "Get started by creating your first job." : "Try adjusting your search or filters."}
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Create your first job
            </button>
          </div>
        )}
      </div>

      {/* Create panel */}
      <JobFormPanel
        open={showCreate}
        mode="create"
        onClose={() => setShowCreate(false)}
        onDone={() => {}}
      />

      {/* Edit panel */}
      <JobFormPanel
        open={!!editingId}
        mode="edit"
        editingId={editingId ?? undefined}
        onClose={() => { setEditingId(null); }}
        onDone={() => {}}
      />

      {/* Delete confirmation */}
      <DeleteConfirm
        open={!!deletingJob}
        job={deletingJob}
        onClose={() => setDeletingJob(null)}
      />
    </div>
  );
}
