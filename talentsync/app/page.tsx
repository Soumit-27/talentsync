import Link from "next/link";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

/* ----------------------------- Data ----------------------------- */

const CATEGORIES = [
  { name: "Engineering", count: "2,340", icon: "code" },
  { name: "Data & AI", count: "960", icon: "spark" },
  { name: "Design", count: "820", icon: "pen" },
  { name: "Product", count: "540", icon: "compass" },
  { name: "Marketing", count: "1,150", icon: "megaphone" },
  { name: "Sales", count: "1,780", icon: "handshake" },
  { name: "Finance", count: "730", icon: "wallet" },
  { name: "HR & People", count: "610", icon: "people" },
];

const JOBS = [
  {
    company: "Razorpay",
    initials: "R",
    color: "bg-blue-50 text-blue-700 ring-blue-100",
    role: "Senior Frontend Developer",
    location: "Bengaluru",
    mode: "Hybrid",
    type: "Full-time",
    salary: "₹28L – ₹42L",
    tags: ["React", "TypeScript", "Next.js"],
    posted: "2d ago",
    match: 96,
    hot: false,
  },
  {
    company: "PhonePe",
    initials: "P",
    color: "bg-violet-50 text-violet-700 ring-violet-100",
    role: "Machine Learning Engineer",
    location: "Pune",
    mode: "On-site",
    type: "Full-time",
    salary: "₹35L – ₹55L",
    tags: ["Python", "MLOps", "LLMs"],
    posted: "Today",
    match: 93,
    hot: true,
  },
  {
    company: "Swiggy",
    initials: "S",
    color: "bg-orange-50 text-orange-700 ring-orange-100",
    role: "Product Manager, Growth",
    location: "Hyderabad",
    mode: "Hybrid",
    type: "Full-time",
    salary: "₹30L – ₹48L",
    tags: ["Growth", "B2C", "Analytics"],
    posted: "1d ago",
    match: 89,
    hot: false,
  },
  {
    company: "Zoho",
    initials: "Z",
    color: "bg-rose-50 text-rose-700 ring-rose-100",
    role: "Product Designer",
    location: "Remote · India",
    mode: "Remote",
    type: "Contract",
    salary: "₹12L – ₹20L",
    tags: ["Figma", "Design Systems"],
    posted: "3d ago",
    match: 87,
    hot: false,
  },
  {
    company: "Freshworks",
    initials: "F",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    role: "Platform / DevOps Engineer",
    location: "Chennai",
    mode: "Hybrid",
    type: "Full-time",
    salary: "₹22L – ₹36L",
    tags: ["AWS", "Kubernetes", "Terraform"],
    posted: "4d ago",
    match: 84,
    hot: false,
  },
  {
    company: "CRED",
    initials: "C",
    color: "bg-slate-100 text-slate-800 ring-slate-200",
    role: "Content Strategist",
    location: "Remote · India",
    mode: "Remote",
    type: "Part-time",
    salary: "₹8L – ₹14L",
    tags: ["Writing", "SEO"],
    posted: "5d ago",
    match: 81,
    hot: false,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Build your profile once",
    body: "Upload your resume or import it. We pull out your skills and preferences in about a minute.",
  },
  {
    n: "02",
    title: "Get matched, not flooded",
    body: "See roles ranked by fit, with the salary range shown upfront. No guessing, no ghost listings.",
  },
  {
    n: "03",
    title: "Apply and stay in the loop",
    body: "One-click apply, live status updates and interview reminders in a single timeline.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I stopped refreshing five job boards. The matches were relevant and I had two interviews in my first week.",
    name: "Ananya S.",
    role: "Frontend Engineer, Bengaluru",
    initials: "AS",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    quote:
      "Seeing the salary range before applying saved me hours. The application tracker is the best part.",
    name: "Rohit M.",
    role: "Product Manager, Pune",
    initials: "RM",
    color: "bg-amber-100 text-amber-700",
  },
  {
    quote:
      "We filled a senior data role in three weeks. Candidates arrived already well-matched to the brief.",
    name: "Priya K.",
    role: "Head of Talent, Fintech startup",
    initials: "PK",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const FAQS = [
  {
    q: "Is TalentSync free for job seekers?",
    a: "Yes. Creating a profile, searching, applying and tracking applications are all free for candidates.",
  },
  {
    q: "How does job matching work?",
    a: "We compare your skills, experience, location and salary preferences with each role and show a match score so you can prioritise where to apply.",
  },
  {
    q: "Do listings show salary?",
    a: "We encourage employers to publish a salary range on every role, and you can filter to show only listings that do.",
  },
  {
    q: "Can I find remote or hybrid roles?",
    a: "Absolutely. Filter by remote, hybrid or on-site, and by city, so you only see roles that fit how you want to work.",
  },
  {
    q: "How do employers post a job?",
    a: "Create an employer account, fill in the role details and publish. Your listing goes live immediately and applicants appear in your dashboard.",
  },
];

const COMPANIES = ["Razorpay", "Swiggy", "Zoho", "PhonePe", "Freshworks", "CRED", "Meesho", "Zerodha"];

/* ----------------------------- Icons ----------------------------- */

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

function Icon({ name, className = "w-5 h-5" }: { name: string } & IconProps) {
  switch (name) {
    case "search":
      return (
        <svg className={className} {...base}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "pin":
      return (
        <svg className={className} {...base}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "arrow":
      return (
        <svg className={className} {...base} strokeWidth={2.2}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg className={className} {...base} strokeWidth={2.6}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      );
    case "bookmark":
      return (
        <svg className={className} {...base}>
          <path d="M6 4h12v17l-6-4-6 4V4Z" />
        </svg>
      );
    case "verified":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5 14.4 4l2.8-.1 1.2 2.5 2.4 1.5-.5 2.8L21 13l-1.9 2.1-.1 2.8-2.7.8-1.6 2.3L12 20l-2.7 1-1.6-2.3-2.7-.8-.1-2.8L3 13l1.4-2.3-.5-2.8 2.4-1.5 1.2-2.5 2.8.1L12 2.5Zm-1.1 12.6 5-5-1.1-1.1-3.9 3.9-1.7-1.7-1.1 1.1 2.8 2.8Z" />
        </svg>
      );
    case "code":
      return (
        <svg className={className} {...base}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      );
    case "spark":
      return (
        <svg className={className} {...base}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      );
    case "pen":
      return (
        <svg className={className} {...base}>
          <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
          <path d="m13.5 6.5 4 4" />
        </svg>
      );
    case "compass":
      return (
        <svg className={className} {...base}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg className={className} {...base}>
          <path d="M4 10v4h3l8 4V6L7 10H4Z" />
          <path d="M18.5 9a4 4 0 0 1 0 6" />
        </svg>
      );
    case "handshake":
      return (
        <svg className={className} {...base}>
          <path d="m3 11 4-4 4 1.5L14 6l7 6-5 5-3-1-3 3-3-3-3-1-1-4Z" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={className} {...base}>
          <path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
          <path d="M4 7V6a2 2 0 0 1 2-2h10M16 14h.01" />
        </svg>
      );
    case "people":
      return (
        <svg className={className} {...base}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.8 3 2.6 3 4.7" />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} {...base}>
          <path d="M12 3 5 6v5.5c0 4.3 3 7.7 7 9.5 4-1.8 7-5.2 7-9.5V6l-7-3Z" />
          <path d="m9 12 2.2 2.2L15.5 10" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={className} {...base}>
          <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />
        </svg>
      );
    case "rupee":
      return (
        <svg className={className} {...base}>
          <path d="M7 5h10M7 9h10M7 5c5 0 7 1.5 7 4s-2 4-7 4l7 6" />
        </svg>
      );
    case "plus":
      return (
        <svg className={className} {...base} strokeWidth={2}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    default:
      return null;
  }
}

/* ----------------------------- Page ----------------------------- */

export default function Home() {
  return (
    <main
      className={`${sans.className} relative bg-[#FAFAF8] text-slate-900 antialiased selection:bg-indigo-600 selection:text-white`}
    >
      <style>{`
        @keyframes ts-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ts-float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-10px) rotate(var(--r,0deg)); } }
        @keyframes ts-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ts-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.55); } 100% { box-shadow: 0 0 0 10px rgba(16,185,129,0); } }
        .ts-marquee { animation: ts-marquee 38s linear infinite; }
        .ts-float { animation: ts-float 7s ease-in-out infinite; }
        .ts-float-slow { animation: ts-float 9s ease-in-out infinite; animation-delay: -3s; }
        .ts-rise { animation: ts-rise .7s cubic-bezier(.2,.7,.2,1) both; }
        .ts-pulse { animation: ts-pulse-ring 1.8s ease-out infinite; }
        .ts-grid {
          background-image:
            linear-gradient(to right, rgba(15,23,42,.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%);
        }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .ts-plus { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce) {
          .ts-marquee, .ts-float, .ts-float-slow, .ts-rise, .ts-pulse { animation: none !important; }
        }
      `}</style>

      {/* ───────────── Nav ───────────── */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] px-3 sm:px-4 h-14">
          <Link href="/" className="flex items-center gap-2.5 pl-1">
            <span className="w-8 h-8 rounded-[10px] bg-slate-950 text-white grid place-items-center text-sm font-extrabold">
              T
            </span>
            <span className="text-[17px] font-bold tracking-tight">TalentSync</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            {[
              ["Find jobs", "/jobposts"],
              ["Categories", "#categories"],
              ["How it works", "#how"],
              ["For employers", "#employers"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="px-3.5 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-950 transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-slate-950 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 transition inline-flex items-center gap-1.5"
            >
              Get started <Icon name="arrow" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <div className="ts-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-r from-indigo-300/40 via-violet-300/40 to-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="/jobposts"
              className="ts-rise inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/90 pl-2 pr-4 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:border-slate-300 transition"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold">
                <span className="ts-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
              10,000+ new roles added this month
              <Icon name="arrow" className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <h1
              className="ts-rise mt-7 text-[2.6rem] sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.035em] leading-[1.02] text-slate-950"
              style={{ animationDelay: "80ms" }}
            >
              Your next career move,{" "}
              <span className={`${serif.className} font-normal italic text-indigo-600 tracking-normal`}>
                matched
              </span>{" "}
              to you.
            </h1>

            <p
              className="ts-rise mt-6 text-lg md:text-xl text-slate-600 leading-8 max-w-2xl mx-auto"
              style={{ animationDelay: "160ms" }}
            >
              Smart matching, salaries shown upfront and a live tracker for every application.
              Join India&apos;s fastest-growing teams, without the endless scrolling.
            </p>

            {/* Search */}
            <form
              action="/jobposts"
              method="get"
              className="ts-rise mt-10 mx-auto max-w-3xl rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.35)] flex flex-col sm:flex-row gap-1.5 text-left"
              style={{ animationDelay: "240ms" }}
            >
              <label className="flex items-center gap-3 flex-1 px-4 py-3.5 rounded-2xl text-slate-400 focus-within:text-indigo-600 focus-within:bg-indigo-50/50 transition">
                <Icon name="search" />
                <input
                  name="q"
                  type="text"
                  aria-label="Job title or skill"
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </label>
              <div className="hidden sm:block w-px bg-slate-200 my-2.5" />
              <label className="flex items-center gap-3 sm:w-[38%] px-4 py-3.5 rounded-2xl text-slate-400 focus-within:text-indigo-600 focus-within:bg-indigo-50/50 transition">
                <Icon name="pin" />
                <input
                  name="location"
                  type="text"
                  aria-label="City or remote"
                  placeholder="City or remote"
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </label>
              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-indigo-600 transition inline-flex items-center justify-center gap-2"
              >
                Search <Icon name="arrow" className="w-4 h-4" />
              </button>
            </form>

            <div
              className="ts-rise mt-6 flex flex-wrap items-center justify-center gap-2 text-sm"
              style={{ animationDelay: "320ms" }}
            >
              <span className="text-slate-500 mr-1">Trending:</span>
              {["AI Engineer", "React Developer", "Product Manager", "Data Analyst", "Remote"].map((t) => (
                <Link
                  key={t}
                  href={`/jobposts?q=${encodeURIComponent(t)}`}
                  className="px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-white transition"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Hero visual: floating product cards */}
          <div className="relative mt-16 md:mt-20 hidden md:block h-[330px] max-w-4xl mx-auto">
            {/* Job card */}
            <div
              className="ts-float absolute left-0 top-6 w-[320px] rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] p-5"
              style={{ ["--r" as string]: "-3deg" }}
            >
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 grid place-items-center font-bold">
                  R
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold leading-tight">Senior Frontend Developer</p>
                  <p className="text-sm text-slate-500 mt-0.5">Razorpay · Bengaluru</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-1">96%</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Hybrid", "Full-time", "₹28L – ₹42L"].map((t) => (
                  <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 h-10 rounded-xl bg-slate-950 text-white text-sm font-semibold grid place-items-center">
                Quick apply
              </div>
            </div>

            {/* Match insight */}
            <div className="ts-float-slow absolute left-1/2 -translate-x-1/2 top-0 w-[290px] rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Match insight</p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">94%</p>
              <p className="text-sm text-indigo-100 mt-1">Your skills fit 8 of 9 requirements</p>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-[94%] rounded-full bg-white" />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Node.js"].map((s) => (
                  <span key={s} className="text-[11px] font-medium bg-white/15 rounded-full px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Tracker */}
            <div
              className="ts-float absolute right-0 top-10 w-[300px] rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] p-5"
              style={{ ["--r" as string]: "3deg", animationDelay: "-2s" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Application status</p>
              <ol className="mt-4 space-y-3.5">
                {[
                  { label: "Submitted", done: true },
                  { label: "Under review", done: true },
                  { label: "Interview scheduled", done: false, active: true },
                  { label: "Offer", done: false },
                ].map((s) => (
                  <li key={s.label} className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full grid place-items-center ${
                        s.done
                          ? "bg-emerald-500 text-white"
                          : s.active
                          ? "border-2 border-indigo-500"
                          : "border-2 border-slate-200"
                      }`}
                    >
                      {s.done ? <Icon name="check" className="w-3 h-3" /> : s.active ? <span className="w-2 h-2 rounded-full bg-indigo-500" /> : null}
                    </span>
                    <span
                      className={`text-sm ${
                        s.done ? "font-medium text-slate-900" : s.active ? "font-semibold text-indigo-700" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Logo marquee ───────────── */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
          <p className="text-center text-sm font-medium text-slate-500">
            Teams at India&apos;s fastest-growing companies hire on TalentSync
          </p>
          <div
            className="mt-7 overflow-hidden"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            }}
          >
            <div className="ts-marquee flex w-max gap-14 pr-14">
              {[...COMPANIES, ...COMPANIES].map((c, i) => (
                <span key={c + i} className="text-2xl font-bold tracking-tight text-slate-300 whitespace-nowrap">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Bento: why TalentSync ───────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-indigo-600">Why TalentSync</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              A job search that respects{" "}
              <span className={`${serif.className} font-normal italic text-indigo-600`}>your time.</span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(0,1fr)]">
            {/* Big: match */}
            <div className="md:col-span-4 relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 md:p-10 min-h-[320px]">
              <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl" />
              <span className="relative inline-grid place-items-center w-11 h-11 rounded-xl bg-white/10 text-indigo-200">
                <Icon name="spark" />
              </span>
              <h3 className="relative mt-6 text-2xl md:text-3xl font-bold tracking-tight max-w-md">
                Smart matching that reads between the lines
              </h3>
              <p className="relative mt-3 text-slate-300 max-w-md leading-7">
                Every role shows how well it fits your skills, experience and goals, so you apply where you have
                the best shot.
              </p>
              <div className="relative mt-8 flex flex-wrap gap-3">
                {[
                  ["Senior Frontend Dev", "96%"],
                  ["Staff Engineer", "91%"],
                  ["Tech Lead", "88%"],
                ].map(([r, m]) => (
                  <div
                    key={r}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.07] border border-white/10 px-4 py-2.5"
                  >
                    <span className="text-sm font-medium">{r}</span>
                    <span className="text-xs font-bold text-emerald-300">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8">
              <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600">
                <Icon name="rupee" />
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">Salary shown upfront</h3>
              <p className="mt-2 text-slate-600 leading-7 text-[15px]">
                Filter by pay range and skip the roles that waste your time.
              </p>
              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-500">Product Manager · Hyderabad</p>
                <p className="mt-1 font-extrabold text-xl tracking-tight">₹30L – ₹48L</p>
              </div>
            </div>

            {/* Verified */}
            <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8">
              <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">
                <Icon name="shield" />
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">Verified employers</h3>
              <p className="mt-2 text-slate-600 leading-7 text-[15px]">
                Real companies, real openings. Listings are reviewed before they go live.
              </p>
            </div>

            {/* Tracker */}
            <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8">
              <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600">
                <Icon name="bolt" />
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">One-click apply</h3>
              <p className="mt-2 text-slate-600 leading-7 text-[15px]">
                Your profile does the heavy lifting. Apply in seconds and follow every step.
              </p>
            </div>

            {/* Stat */}
            <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 flex flex-col justify-between">
              <p className="text-sm font-semibold text-indigo-200">Response rate</p>
              <div>
                <p className="text-6xl font-extrabold tracking-tight">92%</p>
                <p className="mt-2 text-indigo-100 text-[15px]">of candidates hear back within a week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Categories ───────────── */}
      <section id="categories" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600">Browse by field</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                Roles in every discipline
              </h2>
            </div>
            <Link
              href="/jobposts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-indigo-600 transition"
            >
              View all categories <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/jobposts?category=${encodeURIComponent(c.name)}`}
                className="group relative rounded-2xl border border-slate-200 bg-white p-5 md:p-6 hover:border-slate-900 transition overflow-hidden"
              >
                <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Icon name={c.icon} />
                </span>
                <h3 className="mt-5 font-bold tracking-tight">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{c.count} open roles</p>
                <span className="absolute top-5 right-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition">
                  <Icon name="arrow" className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Featured jobs ───────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-slate-200/70">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600">Featured roles</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                Fresh openings,{" "}
                <span className={`${serif.className} font-normal italic text-indigo-600`}>hand-picked</span>
              </h2>
            </div>
            <Link
              href="/jobposts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-indigo-600 transition"
            >
              See all jobs <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {JOBS.map((j) => (
              <article
                key={j.role + j.company}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-[#FAFAF8] p-6 hover:bg-white hover:border-slate-300 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] hover:-translate-y-1 transition"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`w-12 h-12 rounded-xl ring-1 grid place-items-center font-bold text-lg ${j.color}`}
                  >
                    {j.initials}
                  </span>
                  <div className="flex items-center gap-2">
                    {j.hot && (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-orange-700 bg-orange-50 rounded-full px-2.5 py-1">
                        Hot
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Save ${j.role}`}
                      className="w-8 h-8 grid place-items-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <Icon name="bookmark" className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight">{j.role}</h3>
                <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                  {j.company}
                  <Icon name="verified" className="w-4 h-4 text-indigo-500" />
                  <span className="text-slate-300">·</span> {j.location}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {j.type}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {j.mode}
                  </span>
                  {j.tags.map((t) => (
                    <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200/80 flex items-center justify-between mt-auto">
                  <div>
                    <p className="font-extrabold tracking-tight">{j.salary}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {j.posted} · <span className="text-emerald-600 font-semibold">{j.match}% match</span>
                    </p>
                  </div>
                  <Link
                    href="/jobposts"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-indigo-600 transition"
                  >
                    Apply <Icon name="arrow" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section id="how" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold text-indigo-600">How it works</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              From signup to offer in three steps
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-5 relative">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-3xl border border-slate-200 bg-white p-8">
                <span className="inline-grid place-items-center w-11 h-11 rounded-full bg-slate-950 text-white text-sm font-bold">
                  {s.n}
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-slate-600 leading-7">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Testimonials ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-indigo-600">Loved by candidates and teams</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              People are{" "}
              <span className={`${serif.className} font-normal italic text-indigo-600`}>getting hired.</span>
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col">
                <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <blockquote className="mt-5 text-[17px] leading-8 text-slate-800 flex-1">“{t.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full grid place-items-center text-sm font-bold ${t.color}`}>
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-sm text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Employers ───────────── */}
      <section id="employers" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-slate-950 text-white">
            <div className="pointer-events-none absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-violet-600/30 blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-12 p-8 md:p-14 items-center">
              <div>
                <p className="text-sm font-semibold text-indigo-300">For employers</p>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                  Hire great people,{" "}
                  <span className={`${serif.className} font-normal italic text-indigo-300`}>faster.</span>
                </h2>
                <p className="mt-5 text-slate-300 text-lg leading-8 max-w-lg">
                  Post a role in minutes, receive pre-matched applicants and manage your whole pipeline from one
                  dashboard.
                </p>
                <ul className="mt-8 space-y-3.5">
                  {[
                    "Go live instantly, no sales call needed",
                    "Applicants ranked by fit to your brief",
                    "Simple pipeline from review to offer",
                  ].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center">
                        <Icon name="check" className="w-3 h-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/jobposts/create"
                    className="px-7 py-3.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-indigo-50 transition inline-flex items-center gap-2"
                  >
                    Post a job <Icon name="arrow" className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-7 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition"
                  >
                    Create employer account
                  </Link>
                </div>
              </div>

              {/* Pipeline mock */}
              <div className="rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Senior Frontend Developer</p>
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 rounded-full px-2.5 py-1">
                    Active
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["148", "Applicants"],
                    ["32", "Shortlisted"],
                    ["6", "Interviews"],
                  ].map(([n, l]) => (
                    <div key={l} className="rounded-xl bg-white/[0.06] py-4">
                      <p className="text-2xl font-extrabold">{n}</p>
                      <p className="text-xs text-slate-400 mt-1">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-2.5">
                  {[
                    ["Aarav P.", "96%"],
                    ["Meera N.", "93%"],
                    ["Karthik R.", "90%"],
                  ].map(([name, m]) => (
                    <div key={name} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-4 py-3">
                      <span className="flex items-center gap-3 text-sm">
                        <span className="w-8 h-8 rounded-full bg-indigo-500/30 grid place-items-center text-xs font-bold">
                          {name[0]}
                        </span>
                        {name}
                      </span>
                      <span className="text-xs font-bold text-emerald-300">{m} match</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Stats ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 text-center divide-x-0 md:divide-x divide-slate-200">
            {[
              ["10K+", "Active roles"],
              ["5K+", "Hiring companies"],
              ["50K+", "Candidates"],
              ["25+", "Cities covered"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-4xl md:text-6xl font-extrabold tracking-[-0.04em]">{n}</p>
                <p className="mt-2 text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600">FAQ</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              Questions, answered
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-6 md:px-8 py-5">
                <summary className="flex items-center justify-between gap-6 cursor-pointer font-semibold text-[17px]">
                  {f.q}
                  <span className="ts-plus shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 grid place-items-center transition-transform">
                    <Icon name="plus" className="w-4 h-4" />
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 leading-7 pr-12">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-8 py-16 md:px-16 md:py-24 text-center">
            <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10" />
            <h2 className="relative text-3xl md:text-6xl font-extrabold tracking-[-0.035em] text-white leading-[1.04]">
              Your next role is{" "}
              <span className={`${serif.className} font-normal italic`}>one click</span> away.
            </h2>
            <p className="relative mt-5 text-indigo-100 text-lg max-w-xl mx-auto">
              Create your free profile in minutes and let great opportunities find you.
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition inline-flex items-center gap-2"
              >
                Create free account <Icon name="arrow" className="w-4 h-4" />
              </Link>
              <Link
                href="/jobposts"
                className="px-8 py-4 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition"
              >
                Browse jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-[10px] bg-slate-950 text-white grid place-items-center text-sm font-extrabold">
                T
              </span>
              <span className="text-[17px] font-bold tracking-tight">TalentSync</span>
            </div>
            <p className="mt-4 text-sm text-slate-500 max-w-xs leading-6">
              Connecting professionals with great companies across India, in real time.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">For candidates</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li><Link href="/jobposts" className="hover:text-slate-900">Browse jobs</Link></li>
              <li><Link href="/auth/register" className="hover:text-slate-900">Create profile</Link></li>
              <li><Link href="/auth/login" className="hover:text-slate-900">Log in</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold">For employers</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li><Link href="/jobposts/create" className="hover:text-slate-900">Post a job</Link></li>
              <li><Link href="/auth/register" className="hover:text-slate-900">Hire talent</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <p className="mx-auto max-w-6xl px-5 md:px-8 py-6 text-sm text-slate-400">
            © 2026 TalentSync. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}