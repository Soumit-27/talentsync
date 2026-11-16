"use client";
import { resumeViewUrl } from "../../services/resume";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRound, FileText, ArrowRight } from "lucide-react";
import {
  getProfile,
  createProfile,
  uploadResume,
  type CreateProfilePayload,
} from "../../services/profile";
import type { CandidateProfile } from "../../services/job_application";
import { errorMessage } from "../../services/api";
import { useSession } from "../../components/ProtectedRoute";
import {
  Page,
  PageTitle,
  Field,
  ErrorState,
  Loading,
  Notice,
  inputClass,
  buttonClass,
  cardClass,
  secondaryClass,
} from "../../components/ui";
const empty: CreateProfilePayload = {
  phone: "",
  title: "",
  about: "",
  experience: 0,
  currentCompany: "",
  currentSalary: 0,
  expectedSalary: 0,
  noticePeriod: "Immediate",
  location: "",
  preferredLocation: "",
  github: "",
  linkedin: "",
  portfolio: "",
};
function ProfileForm({ initial }: { initial: CandidateProfile | null }) {
  const user = useSession();
  const router = useRouter();
  const client = useQueryClient();
  const [form, setForm] = useState<CreateProfilePayload>(
    () =>
      Object.fromEntries(
        Object.entries(empty).map(([key, value]) => [
          key,
          initial?.[key as keyof CandidateProfile] ?? value,
        ]),
      ) as unknown as CreateProfilePayload,
  );
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [saved, setSaved] = useState(false);
  const [resume, setResume] = useState(initial?.resumeUrl);
  const change = (key: keyof CreateProfilePayload, value: string | number) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    setSaved(false);
    try {
      if (
        file &&
        (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024)
      )
        throw new Error("Choose a PDF resume of 5 MB or smaller.");
      await createProfile(form);
      await client.invalidateQueries({ queryKey: ["session"] });
      if (file) {
        try {
          const result = await uploadResume(file);
          setResume(result.resumeUrl);
          setFile(null);
        } catch (failure) {
          throw new Error(
            "Your profile was saved, but the resume upload failed. " +
              errorMessage(failure) +
              " You can retry by saving again, or continue without a resume.",
          );
        }
      }
      await client.invalidateQueries({ queryKey: ["candidate-profile"] });
      setSaved(true);
      if (!user.profileCompleted) router.replace("/candidateDashboard");
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  }
  const text = (
    key: keyof CreateProfilePayload,
    label: string,
    required = false,
    type = "text",
    placeholder = "",
  ) => (
    <Field label={label}>
      <input
        className={inputClass}
        type={type}
        required={required}
        value={form[key]}
        onChange={(event) => change(key, event.target.value)}
        placeholder={placeholder}
        maxLength={key === "phone" ? 20 : 200}
      />
    </Field>
  );
  return (
    <form onSubmit={submit} className="space-y-6">
      {saved && (
        <Notice>
          Profile saved. Your updated details will be available with your
          applications.
        </Notice>
      )}
      {error != null && <ErrorState error={error} />}
      <section className={cardClass}>
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <UserRound size={22} />
          </span>
          <div>
            <h2 className="font-bold text-slate-900">
              Tell employers about yourself
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Start with the essentials. Fields marked * are required.
            </p>
          </div>
        </div>
        <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
          {text(
            "title",
            "Headline / field of study *",
            true,
            "text",
            "Computer science student / Frontend developer",
          )}
          {text("phone", "Phone number *", true, "tel", "+91 9876543210")}
          {text("location", "Current city *", true, "text", "Bengaluru")}
          {text(
            "preferredLocation",
            "Preferred location",
            false,
            "text",
            "Remote, Bengaluru",
          )}
          <Field
            label="Years of experience"
            hint="Enter 0 if you are a student or fresher."
          >
            <input
              className={inputClass}
              type="number"
              min="0"
              max="50"
              step="1"
              value={form.experience}
              onChange={(event) =>
                change("experience", Number(event.target.value))
              }
            />
          </Field>
          {text("currentCompany", "Current company / college")}
          <div className="sm:col-span-2">
            <Field
              label="About you"
              hint="Mention your education, skills, projects, and the kind of opportunity you want."
            >
              <textarea
                className={inputClass}
                rows={5}
                maxLength={5000}
                value={form.about}
                onChange={(event) => change("about", event.target.value)}
              />
            </Field>
          </div>
          <Field
            label="Expected annual salary (INR)"
            hint="Optional. Enter 0 if you are open to discussion."
          >
            <input
              className={inputClass}
              type="number"
              min="0"
              step="1000"
              value={form.expectedSalary}
              onChange={(event) =>
                change("expectedSalary", Number(event.target.value))
              }
            />
          </Field>
          <Field label="Availability">
            <select
              className={inputClass}
              value={form.noticePeriod}
              onChange={(event) => change("noticePeriod", event.target.value)}
            >
              {["Immediate", "15 Days", "30 Days", "60 Days", "90 Days"].map(
                (option) => (
                  <option key={option}>{option}</option>
                ),
              )}
            </select>
          </Field>
          {text(
            "linkedin",
            "LinkedIn URL",
            false,
            "url",
            "https://linkedin.com/in/your-name",
          )}
          {text(
            "github",
            "GitHub URL",
            false,
            "url",
            "https://github.com/your-name",
          )}
          {text(
            "portfolio",
            "Portfolio URL",
            false,
            "url",
            "https://your-portfolio.com",
          )}
        </fieldset>
      </section>
      <section className={cardClass}>
        <div className="mb-4 flex items-center gap-3">
          <FileText size={22} className="text-indigo-600" />
          <div>
            <h2 className="font-bold text-slate-900">Your resume</h2>
            <p className="mt-1 text-sm text-slate-500">
              Optional PDF, up to 5 MB. Uploaded securely when you save your
              profile.
            </p>
          </div>
        </div>
        {resume && (
          <a
            href={resumeViewUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block text-sm font-semibold text-indigo-600 underline"
          >
            View current resume
          </a>
        )}
        <Field label={resume ? "Replace resume" : "Upload resume"}>
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={busy}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className={inputClass}
          />
        </Field>
      </section>
      <div className="flex flex-wrap justify-end gap-3">
        {user.profileCompleted && (
          <Link href="/candidateDashboard" className={secondaryClass}>
            Back to jobs
          </Link>
        )}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy
            ? "Saving your profile..."
            : user.profileCompleted
              ? "Save changes"
              : "Save and explore jobs"}
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
}
export default function ProfilePage() {
  const profile = useQuery({
    queryKey: ["candidate-profile"],
    queryFn: getProfile,
  });
  return (
    <Page>
      <PageTitle
        eyebrow="Your profile"
        title="A great opportunity starts with you."
        description="Create a profile once, then apply to jobs and internships with a single click."
      />
      {profile.isPending ? (
        <Loading />
      ) : profile.isError ? (
        <ErrorState
          error={profile.error}
          retry={() => void profile.refetch()}
        />
      ) : (
        <ProfileForm key={profile.data?.id ?? "new"} initial={profile.data} />
      )}
    </Page>
  );
}
