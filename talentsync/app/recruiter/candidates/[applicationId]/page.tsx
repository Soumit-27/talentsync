"use client";
import { resumeViewUrl } from "../../../services/resume";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, MapPin, FileText } from "lucide-react";
import { getApplication } from "../../../services/job_application";
import ApplicationActions from "../../../components/ApplicationActions";
import {
  Page,
  PageTitle,
  Loading,
  ErrorState,
  Status,
  cardClass,
  secondaryClass,
  salaryLabel,
  dateTime,
} from "../../../components/ui";
export default function CandidateDetails() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const query = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplication(applicationId),
    refetchInterval: 30000,
  });
  if (query.isPending) return <Loading text="Loading candidate profile..." />;
  if (query.isError)
    return (
      <ErrorState error={query.error} retry={() => void query.refetch()} />
    );
  const application = query.data.data;
  const candidate = application.candidate;
  const user = candidate?.user;
  const info = [
    { label: "Experience", value: (candidate?.experience ?? 0) + " years" },
    {
      label: "Company / college",
      value: candidate?.currentCompany || "Not provided",
    },
    {
      label: "Preferred location",
      value: candidate?.preferredLocation || "Not provided",
    },
    {
      label: "Expected salary",
      value: candidate?.expectedSalary
        ? salaryLabel(candidate.expectedSalary)
        : "Open to discussion",
    },
    { label: "Availability", value: candidate?.noticePeriod || "Not provided" },
    { label: "Phone", value: candidate?.phone || "Not provided" },
  ];
  return (
    <Page>
      <Link href="/candidates" className={secondaryClass}>
        <ArrowLeft size={16} />
        All candidates
      </Link>
      <PageTitle
        eyebrow={"Application for " + application.job.title}
        title={user?.name || "Candidate profile"}
        description={"Applied on " + dateTime(application.appliedAt)}
        action={<Status value={application.status} />}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <section className={cardClass}>
            <h2 className="text-xl font-bold text-slate-900">
              {candidate?.title || "Candidate"}
            </h2>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              {user?.email && (
                <a
                  href={"mailto:" + user.email}
                  className="flex items-center gap-2"
                >
                  <Mail size={16} />
                  {user.email}
                </a>
              )}
              {candidate?.location && (
                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  {candidate.location}
                </p>
              )}
            </div>
            <h3 className="mt-7 text-sm font-semibold text-slate-900">About</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {candidate?.about ||
                "This candidate has not added an introduction."}
            </p>
            <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
              {info.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-slate-400">{item.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={cardClass}>
            <h2 className="font-bold text-slate-900">Resume and links</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {candidate?.resumeUrl ? (
                <a
                  href={resumeViewUrl(application.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryClass}
                >
                  <FileText size={16} />
                  View resume
                </a>
              ) : (
                <p className="text-sm text-slate-500">No resume uploaded.</p>
              )}
              {[
                { label: "LinkedIn", url: candidate?.linkedin },
                { label: "GitHub", url: candidate?.github },
                { label: "Portfolio", url: candidate?.portfolio },
              ]
                .filter((item) => item.url && /^https?:\/\//i.test(item.url))
                .map((item) => (
                  <a
                    key={item.label}
                    href={item.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={secondaryClass}
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </section>
        </div>
        <section className={cardClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Move this application forward
          </h2>
          <ApplicationActions
            key={
              application.updatedAt + (application.interview?.scheduledAt ?? "")
            }
            application={application}
          />
        </section>
      </div>
    </Page>
  );
}
