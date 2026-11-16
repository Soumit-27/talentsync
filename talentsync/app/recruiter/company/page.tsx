"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, ArrowRight } from "lucide-react";
import {
  getMyCompany,
  createCompany,
  updateCompany,
  type Company,
  type CompanyPayload,
} from "../../services/company";
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
} from "../../components/ui";
function CompanyForm({ company }: { company: Company | null }) {
  const router = useRouter();
  const client = useQueryClient();
  const [form, setForm] = useState<CompanyPayload>({
    name: company?.name ?? "",
    description: company?.description ?? "",
    website: company?.website ?? "",
    location: company?.location ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [saved, setSaved] = useState(false);
  const change = (key: keyof CompanyPayload, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await (company ? updateCompany(form) : createCompany(form));
      await Promise.all([
        client.invalidateQueries({ queryKey: ["company"] }),
        client.invalidateQueries({ queryKey: ["session"] }),
        client.invalidateQueries({ queryKey: ["my-jobs"] }),
      ]);
      setSaved(true);
      if (!company) router.replace("/dashboard");
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className={cardClass + " max-w-3xl space-y-6"}>
      {saved && <Notice>Company details saved.</Notice>}
      {error != null && <ErrorState error={error} />}
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Building2 size={24} />
        </span>
        <div>
          <h2 className="font-bold text-slate-900">
            {company ? "Company details" : "Welcome to your hiring workspace"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your company name appears on every job you publish.
          </p>
        </div>
      </div>
      <fieldset disabled={busy} className="space-y-5">
        <Field label="Company name *">
          <input
            className={inputClass}
            required
            minLength={2}
            maxLength={150}
            value={form.name}
            onChange={(event) => change("name", event.target.value)}
            placeholder="Acme Technologies"
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
            placeholder="Bengaluru, India"
          />
        </Field>
        <Field label="Website">
          <input
            className={inputClass}
            type="url"
            value={form.website}
            onChange={(event) => change("website", event.target.value)}
            placeholder="https://your-company.com"
          />
        </Field>
        <Field label="About the company">
          <textarea
            className={inputClass}
            rows={5}
            maxLength={5000}
            value={form.description}
            onChange={(event) => change("description", event.target.value)}
            placeholder="What you do, your team, and what makes working here special."
          />
        </Field>
      </fieldset>
      <button type="submit" disabled={busy} className={buttonClass}>
        {busy
          ? "Saving..."
          : company
            ? "Save company details"
            : "Create company and continue"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
export default function CompanyPage() {
  const company = useQuery({ queryKey: ["company"], queryFn: getMyCompany });
  return (
    <Page>
      <PageTitle
        eyebrow="Company profile"
        title="Give your team a home."
        description="Set up your company, publish opportunities, and manage your hiring in one place."
      />
      {company.isPending ? (
        <Loading />
      ) : company.isError ? (
        <ErrorState
          error={company.error}
          retry={() => void company.refetch()}
        />
      ) : (
        <CompanyForm
          key={company.data.data?.id ?? "new"}
          company={company.data.data}
        />
      )}
    </Page>
  );
}
