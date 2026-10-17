"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import {
  CreateProfilePayload,
  createProfile,
  uploadResume,
} from "@/app/services/profile";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getLoginUser } from "@/app/services/auth";

// ============================================================
//  Types (matching your existing schema)
// ============================================================
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
  onSubmit?: (profile: CandidateProfile, isDraft: boolean) => void;
}

// ============================================================
//  Main Component
// ============================================================
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
    initialData?.imageUrl ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CandidateProfile, string>>
  >({});

  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const getUserMutation = useMutation({
    mutationFn: getLoginUser,

    onSuccess: (response) => {
      if (response.user.profileCompleted) {
        router.push("/candidateDashboard");
      }
    },

    onError: (error) => {
      console.error("Failed to check profile:", error);
    },
  });

  useEffect(() => {
    getUserMutation.mutate();
  }, []);

  // ------------------------------------------------------------
  //  Helpers
  // ------------------------------------------------------------
  function update<K extends keyof CandidateProfile>(
    key: K,
    value: CandidateProfile[K],
  ) {
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
    // TODO: upload to cloud and set profile.imageUrl
  }

  function handleResumeChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setResumeFile(file);
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof CandidateProfile, string>> = {};
    if (!profile.title.trim()) nextErrors.title = "Job title is required.";
    if (!/^\d{10}$/.test(profile.phone))
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!profile.location.trim())
      nextErrors.location = "Current location is required.";
    if (profile.expectedSalary <= 0)
      nextErrors.expectedSalary = "Enter an expected salary.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent, isDraft: boolean) {
    e.preventDefault();
    if (!isDraft && !validate()) return;

    setSaving(true);
    try {
      // ------------------------------------------------------------
      //  Build payload exactly as your API expects
      //  (no userId, resumeUrl, imageUrl – those are separate)
      // ------------------------------------------------------------
      const payload: CreateProfilePayload = {
        phone: profile.phone,
        title: profile.title,
        about: profile.about,
        experience: profile.experience,
        currentCompany: profile.currentCompany,
        currentSalary: profile.currentSalary,
        expectedSalary: profile.expectedSalary,
        noticePeriod: profile.noticePeriod,
        location: profile.location,
        preferredLocation: profile.preferredLocation,
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
      };

      const result = await createProfile(payload);

      console.log("Profile saved:", result);

      // Upload resume after profile is created
      if (resumeFile) {
        const resumeResult = await uploadResume(resumeFile);

        console.log("Resume uploaded:", resumeResult);

        if (resumeResult.resumeUrl) {
          update("resumeUrl", resumeResult.resumeUrl);
        }
      }

      router.push("/candidateDashboard");

      if (onSubmit) {
        onSubmit(profile, isDraft);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Optionally show a toast notification
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------------------------
  //  Reusable input field (with improved placeholder styling)
  // ------------------------------------------------------------
  const renderField = ({
    label,
    name,
    type = "text",
    placeholder,
    required,
    value,
    onChange,
    error,
    className = "",
  }: {
    label: string;
    name: keyof CandidateProfile;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    className?: string;
  }) => (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  // ============================================================
  //  Render
  // ============================================================
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 md:p-8">
      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="w-full max-w-7xl rounded-xl border-t-4 border-blue-600 bg-white p-6 shadow-lg md:p-8 lg:p-10"
      >
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in your details to attract the best opportunities.
          </p>
        </div>

        {/* ========== PERSONAL INFORMATION ========== */}
        <section className="mb-10">
          <h3 className="mb-5 text-xl font-semibold text-gray-800">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <div className="mt-1 flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      Photo
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:ring-blue-400"
                  >
                    Upload
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      update("imageUrl", null);
                      if (imageInputRef.current)
                        imageInputRef.current.value = "";
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Job Title */}
            {renderField({
              label: "Job Title",
              name: "title",
              placeholder: "e.g. Frontend Developer",
              required: true,
              value: profile.title,
              onChange: (e) => update("title", e.target.value),
              error: errors.title,
            })}

            {/* Phone */}
            {renderField({
              label: "Phone Number",
              name: "phone",
              type: "tel",
              placeholder: "9876543210",
              required: true,
              value: profile.phone,
              onChange: (e) => update("phone", e.target.value),
              error: errors.phone,
            })}

            {/* Experience */}
            {renderField({
              label: "Experience (years)",
              name: "experience",
              type: "number",
              placeholder: "0",
              value: profile.experience,
              onChange: (e) => update("experience", Number(e.target.value)),
              error: errors.experience,
            })}

            {/* About - full width */}
            <div className="md:col-span-2">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <textarea
                id="about"
                rows={4}
                placeholder="Brief summary about yourself"
                value={profile.about}
                onChange={(e) => update("about", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </section>

        <hr className="my-8 border-gray-200" />

        {/* ========== WORK & SALARY ========== */}
        <section className="mb-10">
          <h3 className="mb-5 text-xl font-semibold text-gray-800">
            Work & Salary
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Current Company */}
            {renderField({
              label: "Current Company",
              name: "currentCompany",
              placeholder: "Company name",
              value: profile.currentCompany,
              onChange: (e) => update("currentCompany", e.target.value),
            })}

            {/* Notice Period */}
            <div>
              <label
                htmlFor="noticePeriod"
                className="block text-sm font-medium text-gray-700"
              >
                Notice Period
              </label>
              <select
                id="noticePeriod"
                value={profile.noticePeriod}
                onChange={(e) => update("noticePeriod", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {NOTICE_PERIOD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Salary */}
            {renderField({
              label: "Current Salary (monthly)",
              name: "currentSalary",
              type: "number",
              placeholder: "50000",
              value: profile.currentSalary,
              onChange: (e) => update("currentSalary", Number(e.target.value)),
            })}

            {/* Expected Salary */}
            {renderField({
              label: "Expected Salary",
              name: "expectedSalary",
              type: "number",
              placeholder: "80000",
              required: true,
              value: profile.expectedSalary,
              onChange: (e) => update("expectedSalary", Number(e.target.value)),
              error: errors.expectedSalary,
            })}

            {/* Current Location */}
            {renderField({
              label: "Current Location",
              name: "location",
              placeholder: "City, Country",
              required: true,
              value: profile.location,
              onChange: (e) => update("location", e.target.value),
              error: errors.location,
            })}

            {/* Preferred Location */}
            {renderField({
              label: "Preferred Location",
              name: "preferredLocation",
              placeholder: "City, Country",
              value: profile.preferredLocation,
              onChange: (e) => update("preferredLocation", e.target.value),
            })}
          </div>
        </section>

        <hr className="my-8 border-gray-200" />

        {/* ========== LINKS & DOCUMENTS ========== */}
        <section className="mb-10">
          <h3 className="mb-5 text-xl font-semibold text-gray-800">
            Links & Documents
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {renderField({
              label: "GitHub",
              name: "github",
              placeholder: "https://github.com/username",
              value: profile.github,
              onChange: (e) => update("github", e.target.value),
            })}
            {renderField({
              label: "LinkedIn",
              name: "linkedin",
              placeholder: "https://linkedin.com/in/username",
              value: profile.linkedin,
              onChange: (e) => update("linkedin", e.target.value),
            })}
            {renderField({
              label: "Portfolio",
              name: "portfolio",
              placeholder: "https://yourportfolio.com",
              value: profile.portfolio,
              onChange: (e) => update("portfolio", e.target.value),
            })}

            {/* Resume Upload - improved dashed area */}
            <div className="md:col-span-2">
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700"
              >
                Resume (PDF, DOC, DOCX)
              </label>
              <div
                className={`mt-1 flex flex-wrap items-center gap-3 rounded-md border-2 border-dashed ${
                  resumeFile || profile.resumeUrl
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-300 bg-white"
                } px-4 py-3 transition-colors`}
              >
                <div className="flex-1 text-sm text-gray-600">
                  {resumeFile ? (
                    <span className="font-medium text-blue-600">
                      {resumeFile.name}
                    </span>
                  ) : profile.resumeUrl ? (
                    <span className="text-green-600">✓ Uploaded</span>
                  ) : (
                    <span className="text-gray-400">
                      Drag & drop or click to upload
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {resumeFile || profile.resumeUrl ? "Replace" : "Browse"}
                </button>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeChange}
                />
                {(resumeFile || profile.resumeUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      update("resumeUrl", null);
                      if (resumeInputRef.current)
                        resumeInputRef.current.value = "";
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========== ACTIONS ========== */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e, true)}
            className="inline-flex justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:ring-blue-400 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Publish Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
