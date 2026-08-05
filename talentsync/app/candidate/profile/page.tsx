"use client"

import { useState, ChangeEvent, FormEvent } from "react";


export interface CandidateProfile {
  id?: string;
  userId: string;
  phone: string;
  title: string;
  about: string;
  experience: number;
  currentCompany: string;
  currentSalary: number;
  expectedSalary: number;
  noticePeriod: string;
  location: string;
  preferredLocation: string;
  github: string;
  linkedin: string;
  portfolio: string;
  resumeUrl: string | null;
  imageUrl: string | null;
}

const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 Days",
  "30 Days",
  "60 Days",
  "90 Days",
];

const EMPTY_PROFILE: CandidateProfile = {
  userId: "",
  phone: "",
  title: "",
  about: "",
  experience: 0,
  currentCompany: "",
  currentSalary: 0,
  expectedSalary: 0,
  noticePeriod: "30 Days",
  location: "",
  preferredLocation: "",
  github: "",
  linkedin: "",
  portfolio: "",
  resumeUrl: null,
  imageUrl: null,
};

interface CandidateProfileFormProps {
  userId: string;
  initialData?: Partial<CandidateProfile>;
  onSubmit: (profile: CandidateProfile, isDraft: boolean) => Promise<void> | void;
}

export default function CandidateProfileForm({
  userId,
  initialData,
  onSubmit,
}: CandidateProfileFormProps) {
  const [profile, setProfile] = useState<CandidateProfile>({
    ...EMPTY_PROFILE,
    ...initialData,
    userId,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl ?? null
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateProfile, string>>>({});

  function update<K extends keyof CandidateProfile>(key: K, value: CandidateProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    // Actual upload to storage (e.g. Cloudinary) happens on submit / elsewhere;
    // profile.imageUrl gets set once the upload resolves.
  }

  function handleResumeChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof CandidateProfile, string>> = {};
    if (!profile.title.trim()) nextErrors.title = "Job title is required.";
    if (!/^\d{10}$/.test(profile.phone)) nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!profile.location.trim()) nextErrors.location = "Current location is required.";
    if (profile.expectedSalary <= 0) nextErrors.expectedSalary = "Enter an expected salary.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent, isDraft: boolean) {
    e.preventDefault();
    if (!isDraft && !validate()) return;

    setSaving(true);
    try {
      await onSubmit(profile, isDraft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e, false)}
      className="max-w-2xl mx-auto p-6 space-y-8"
    >
      <div>
        <h2 className="text-xl font-medium text-gray-900">Complete your profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Recruiters see this before they see your resume. Fill it in fully.
        </p>
      </div>

      {/* Photo */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xs">Photo</span>
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 h-9 px-3 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          <p className="text-xs text-gray-400 mt-1.5">Square image, at least 200x200px.</p>
        </div>
      </div>

      {/* Basic details */}
      <fieldset className="space-y-4">
        <legend className="text-xs uppercase tracking-wide text-gray-400 mb-2">
          Basic details
        </legend>

        <Field label="Job title" error={errors.title}>
          <input
            type="text"
            placeholder="Frontend developer"
            value={profile.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass(!!errors.title)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone number" error={errors.phone}>
            <input
              type="tel"
              placeholder="9876543210"
              value={profile.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass(!!errors.phone)}
            />
          </Field>

          <Field label="Experience (years)">
            <input
              type="number"
              min={0}
              value={profile.experience}
              onChange={(e) => update("experience", Number(e.target.value))}
              className={inputClass(false)}
            />
          </Field>
        </div>

        <Field label="About you">
          <textarea
            rows={3}
            placeholder="A short summary of what you do"
            value={profile.about}
            onChange={(e) => update("about", e.target.value)}
            className={`${inputClass(false)} resize-y`}
          />
        </Field>
      </fieldset>

      {/* Work and compensation */}
      <fieldset className="space-y-4">
        <legend className="text-xs uppercase tracking-wide text-gray-400 mb-2">
          Work and compensation
        </legend>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Current company">
            <input
              type="text"
              placeholder="Company name"
              value={profile.currentCompany}
              onChange={(e) => update("currentCompany", e.target.value)}
              className={inputClass(false)}
            />
          </Field>

          <Field label="Notice period">
            <select
              value={profile.noticePeriod}
              onChange={(e) => update("noticePeriod", e.target.value)}
              className={inputClass(false)}
            >
              {NOTICE_PERIOD_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Current salary (per month)">
            <input
              type="number"
              min={0}
              placeholder="20000"
              value={profile.currentSalary}
              onChange={(e) => update("currentSalary", Number(e.target.value))}
              className={inputClass(false)}
            />
          </Field>

          <Field label="Expected salary (per month)" error={errors.expectedSalary}>
            <input
              type="number"
              min={0}
              placeholder="40000"
              value={profile.expectedSalary}
              onChange={(e) => update("expectedSalary", Number(e.target.value))}
              className={inputClass(!!errors.expectedSalary)}
            />
          </Field>

          <Field label="Current location" error={errors.location}>
            <input
              type="text"
              placeholder="City"
              value={profile.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass(!!errors.location)}
            />
          </Field>

          <Field label="Preferred location">
            <input
              type="text"
              placeholder="City"
              value={profile.preferredLocation}
              onChange={(e) => update("preferredLocation", e.target.value)}
              className={inputClass(false)}
            />
          </Field>
        </div>
      </fieldset>

      {/* Links and resume */}
      <fieldset className="space-y-4">
        <legend className="text-xs uppercase tracking-wide text-gray-400 mb-2">
          Links and resume
        </legend>

        <Field label="GitHub">
          <input
            type="url"
            placeholder="https://github.com/username"
            value={profile.github}
            onChange={(e) => update("github", e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="LinkedIn">
          <input
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={profile.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="Portfolio">
          <input
            type="url"
            placeholder="https://yourportfolio.com"
            value={profile.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
            className={inputClass(false)}
          />
        </Field>

        <Field label="Resume">
          <div className="border border-dashed border-gray-300 rounded-md p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate">
              {resumeFile
                ? resumeFile.name
                : profile.resumeUrl
                ? "Resume uploaded"
                : "No resume uploaded"}
            </span>
            <label className="inline-flex items-center h-8 px-3 text-xs border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 shrink-0 ml-3">
              {profile.resumeUrl || resumeFile ? "Replace" : "Upload"}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
            </label>
          </div>
        </Field>
      </fieldset>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e, true)}
          className="h-9 px-4 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-9 px-4 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors",
    "focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400",
    hasError ? "border-red-400" : "border-gray-300",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}