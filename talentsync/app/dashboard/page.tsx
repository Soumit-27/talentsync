"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Plus,
  Briefcase,
  Users,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { useSession } from "../components/ProtectedRoute";
import { getMyJobs } from "../services/jobpost";
import { getRecruiterApplications } from "../services/job_application";
import { getRecruiterInterviews } from "../services/interview";
import {
  Page,
  Loading,
  ErrorState,
  EmptyState,
  Status,
  dateTime,
  buttonClass,
  secondaryClass,
} from "../components/ui";
export default function RecruiterDashboard() {
  const user = useSession();
  const jobs = useQuery({ queryKey: ["my-jobs"], queryFn: getMyJobs });
  const applications = useQuery({
    queryKey: ["recruiter-applications"],
    queryFn: getRecruiterApplications,
    refetchInterval: 30000,
  });
  const interviews = useQuery({
    queryKey: ["recruiter-interviews"],
    queryFn: getRecruiterInterviews,
  });
  if (jobs.isPending || applications.isPending || interviews.isPending)
    return <Loading text="Loading your hiring workspace..." />;
  if (jobs.isError || applications.isError || interviews.isError)
    return (
      <ErrorState
        error={jobs.error || applications.error || interviews.error}
        retry={() => {
          void jobs.refetch();
          void applications.refetch();
          void interviews.refetch();
        }}
      />
    );
  const listings = jobs.data.data;
  const applicants = applications.data.data;
  const upcoming = interviews.data.data.filter(
    (item) =>
      item.status === "SCHEDULED" &&
      new Date(item.scheduledAt).getTime() >= interviews.dataUpdatedAt,
  );
  const stats = [
    {
      label: "Open jobs",
      value: listings.filter((job) => job.status === "OPEN").length,
      icon: Briefcase,
    },
    { label: "Applications", value: applicants.length, icon: Users },
    {
      label: "Upcoming interviews",
      value: upcoming.length,
      icon: CalendarDays,
    },
    {
      label: "Hired",
      value: applicants.filter((item) => item.status === "HIRED").length,
      icon: UserCheck,
    },
  ];
  const stages = ["APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW", "HIRED", "REJECTED"];
  const colors = ["bg-violet-500", "bg-blue-400", "bg-amber-400", "bg-cyan-400", "bg-emerald-400", "bg-slate-300"];
  const panel = "rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_-16px_rgba(15,23,42,0.2)] sm:p-7";
  return (
    <Page>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace / Overview</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Hiring overview<span className="text-violet-500">.</span></h1></div>
        <div className="flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live workspace</span><Link href="/jobposts/create" className={buttonClass + " rounded-full bg-slate-950 shadow-lg shadow-slate-200 hover:bg-violet-700"}><Plus size={16} />Manage job posts</Link></div>
      </header>
      <section className="relative isolate overflow-hidden rounded-[28px] bg-[#17142e] p-7 text-white sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-32 -z-10 h-96 w-96 rounded-full border-[60px] border-violet-400/10" /><div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-24 -z-10 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-8"><div className="max-w-xl"><span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">{user.company?.name || "Your hiring workspace"}</span><h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Great teams start with<br /><span className="text-violet-300">a great next hire.</span></h2><p className="mt-4 max-w-md text-sm leading-7 text-slate-300">Welcome back, {user.name.split(" ")[0]}. Keep your opportunities moving and give every candidate a clear next step.</p><Link href="/candidates" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">Explore your candidate pipeline <ArrowRight size={16} /></Link></div>
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:w-64"><p className="text-xs text-violet-200">Your hiring snapshot</p><p className="mt-3 text-5xl font-semibold tracking-tight">{applicants.length}<span className="ml-2 text-sm font-normal tracking-normal text-slate-400">applications</span></p><div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/10">{stages.map((stage,index)=><span key={stage} className={colors[index]} style={{width: applicants.length ? (applicants.filter(item=>item.status===stage).length/applicants.length*100)+"%" : "0%"}} />)}</div><div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-400">Open opportunities</span><span className="font-semibold text-white">{stats[0].value}</span></div></div></div>
      </section>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-5">{stats.map(({label,value,icon:Icon},index)=><div key={label} className={panel + " group transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40"}><div className="flex items-center justify-between"><span className={"grid h-10 w-10 place-items-center rounded-2xl " + ["bg-violet-50 text-violet-600","bg-blue-50 text-blue-600","bg-amber-50 text-amber-600","bg-emerald-50 text-emerald-600"][index]}><Icon size={19} /></span><span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">{index===0 ? "Open" : index===2 ? "Upcoming" : "Total"}</span></div><p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs font-medium text-slate-500">{label}</p></div>)}</div>
      {listings.length===0 && <EmptyState title="Your first hire starts with a job post" action={<Link href="/jobposts/create" className={buttonClass}>Create your first job <ArrowRight size={16} /></Link>}>Your company profile is ready. Publish an opportunity and start building your team.</EmptyState>}
      <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold tracking-tight text-slate-900">Your hiring funnel</h2><p className="mt-1 text-xs text-slate-400">A clear picture of every application stage</p></div><Link href="/candidates" className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600">View pipeline <ArrowRight size={14} /></Link></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{stages.map((stage,index)=>{const count=applicants.filter(item=>item.status===stage).length;return <div key={stage} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2"><span className={"h-2 w-2 rounded-full "+colors[index]} /><p className="text-[11px] font-medium capitalize text-slate-500">{stage.toLowerCase()}</p></div><p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{count}</p><div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200/70"><div className={"h-full rounded-full "+colors[index]} style={{width:applicants.length ? (count/applicants.length*100)+"%" : "0%"}} /></div></div>;})}</div></section>
      <div className="grid items-start gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className={panel}><div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold tracking-tight text-slate-900">Fresh in your inbox</h2><p className="mt-1 text-xs text-slate-400">The latest people interested in your team</p></div><Link href="/candidates" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-600" aria-label="View all candidates"><ArrowRight size={17} /></Link></div>{applicants.length===0 ? <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center"><Users size={26} className="mx-auto mb-3 text-violet-300" /><p className="text-sm font-semibold text-slate-700">Your next teammate is on the way</p><p className="mt-2 text-xs leading-6 text-slate-400">Applications to your published jobs will appear here.</p></div> : <div className="space-y-1">{applicants.slice(0,6).map((application,index)=><Link key={application.id} href={"/recruiter/candidates/"+application.id} className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-4 transition hover:bg-slate-50"><div className="flex items-center gap-3"><span className={"grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold "+["bg-violet-100 text-violet-600","bg-amber-100 text-amber-700","bg-blue-100 text-blue-600"][index%3]}>{(application.candidate?.user?.name || "C").split(" ").map(word=>word[0]).slice(0,2).join("")}</span><div><p className="text-sm font-semibold text-slate-800 group-hover:text-violet-600">{application.candidate?.user?.name || "Candidate"}</p><p className="mt-1 text-xs text-slate-400">{application.job.title}</p></div></div><Status value={application.status} /></Link>)}</div>}</section>
        <section className={panel}><div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold tracking-tight text-slate-900">On your calendar</h2><p className="mt-1 text-xs text-slate-400">Make your next conversation count</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-500"><CalendarDays size={18} /></span></div>{upcoming.length===0 ? <div className="rounded-2xl bg-[#f7f5ff] p-7"><p className="text-sm font-semibold text-slate-800">A little breathing room.</p><p className="mt-2 text-xs leading-6 text-slate-500">No upcoming interviews. Open a candidate application to schedule your next conversation.</p><Link href="/candidates" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-violet-600">Find your next conversation <ArrowRight size={14} /></Link></div> : <div className="space-y-3">{upcoming.slice(0,4).map(interview=><div key={interview.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"><p className="text-[11px] font-semibold text-violet-600">{dateTime(interview.scheduledAt)}</p><p className="mt-3 text-sm font-semibold text-slate-900">{interview.application.candidate.user.name}</p><p className="mt-1 text-xs text-slate-400">{interview.application.job.title}</p></div>)}</div>}<Link href="/interviews" className={secondaryClass+" mt-5 w-full rounded-full"}>Manage interviews <ArrowRight size={15} /></Link></section>
      </div>
    </Page>
  );
}
