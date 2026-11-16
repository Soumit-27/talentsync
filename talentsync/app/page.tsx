import { FeaturedJobs } from "./components/PublicJobs";
import Link from "next/link";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import {
  ScrollProgress,
  Reveal,
  CountUp,
  RotatingWord,
  SpotlightCard,
  HeroParallax,
} from "./motion";

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

const STEPS = [
  {
    n: "01",
    title: "Build your profile once",
    body: "Add your headline, education or experience, location, and optional PDF resume.",
  },
  {
    n: "02",
    title: "Explore roles that interest you",
    body: "Search by role, skill, company, or location, and compare the details before applying.",
  },
  {
    n: "03",
    title: "Apply and stay in the loop",
    body: "Apply with your saved profile and follow recruiter decisions and interview details.",
  },
];

const USE_CASES = [
  {
    quote:
      "Build a profile with your education, projects, and interests, then explore internships and entry-level roles.",
    name: "For students",
    role: "Start your career",
    initials: "S",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    quote:
      "Use your saved profile to apply, and keep application decisions and interview details together.",
    name: "For job seekers",
    role: "Stay organized",
    initials: "J",
    color: "bg-amber-100 text-amber-700",
  },
  {
    quote:
      "Create a company profile, publish opportunities, and move candidates from application to a hiring decision.",
    name: "For recruiters",
    role: "Build your team",
    initials: "R",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const FAQS = [
  {
    q: "Is TalentSync free for job seekers?",
    a: "Yes. Creating a profile, searching, applying and tracking applications are all free for candidates.",
  },
  {
    q: "How do I find relevant jobs?",
    a: "Search by job title, skill, company, or location. Filter by job type and read each description before applying.",
  },
  {
    q: "Do listings show salary?",
    a: "Employers can publish an annual salary. When provided, it is shown on the job card; otherwise the card says salary is not specified.",
  },
  {
    q: "Can I find remote or hybrid roles?",
    a: "Search for a city or Remote and check each listing for the employer work arrangements.",
  },
  {
    q: "How do employers post a job?",
    a: "Create an employer account, fill in the role details and publish. Your listing goes live immediately and applicants appear in your dashboard.",
  },
];

const COMPANIES = [
  "Engineering",
  "Design",
  "Product",
  "Data",
  "Marketing",
  "Finance",
  "Operations",
  "Sales",
];
const COMPANIES_B = [
  "Internships",
  "Full-time roles",
  "Remote opportunities",
  "Freshers",
  "Part-time roles",
  "Contract roles",
];

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

/* Reusable section heading */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
      <span className="h-px w-6 bg-indigo-400" />
      {children}
    </p>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function Home() {
  return (
    <main
      className={`${sans.className} relative bg-[#FAFAF8] text-slate-900 antialiased selection:bg-indigo-600 selection:text-white`}
    >
      <ScrollProgress />

      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes ts-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ts-marquee-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes ts-float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-12px) rotate(var(--r,0deg)); } }
        @keyframes ts-rise { from { opacity: 0; transform: translateY(18px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes ts-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.55); } 100% { box-shadow: 0 0 0 10px rgba(16,185,129,0); } }
        @keyframes ts-aurora { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-20px) scale(1.1); } 66% { transform: translate(-30px,20px) scale(.95); } }
        @keyframes ts-shine { from { transform: translateX(-120%); } to { transform: translateX(220%); } }
        @keyframes ts-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes ts-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

        .ts-marquee { animation: ts-marquee 38s linear infinite; }
        .ts-marquee-rev { animation: ts-marquee-rev 44s linear infinite; }
        .ts-marquee:hover, .ts-marquee-rev:hover { animation-play-state: paused; }
        .ts-float { animation: ts-float 7s ease-in-out infinite; }
        .ts-float-slow { animation: ts-float 9s ease-in-out infinite; animation-delay: -3s; }
        .ts-rise { animation: ts-rise .8s cubic-bezier(.2,.7,.2,1) both; }
        .ts-pulse { animation: ts-pulse-ring 1.8s ease-out infinite; }
        .ts-aurora { animation: ts-aurora 18s ease-in-out infinite; }
        .ts-aurora-b { animation: ts-aurora 22s ease-in-out infinite reverse; }
        .ts-bob { animation: ts-bob 1.8s ease-in-out infinite; }

        .ts-grad-text {
          background-image: linear-gradient(90deg, #4f46e5, #9333ea, #db2777, #4f46e5);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          animation: ts-gradient 6s linear infinite;
        }

        /* Primary button with a moving shine */
        .ts-btn-shine { position: relative; overflow: hidden; isolation: isolate; }
        .ts-btn-shine::after {
          content: ""; position: absolute; inset: 0; width: 40%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-120%); z-index: -1;
        }
        .ts-btn-shine:hover::after { animation: ts-shine .9s ease; }

        .ts-grid {
          background-image:
            linear-gradient(to right, rgba(15,23,42,.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%);
        }
        .ts-noise::before {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: radial-gradient(rgba(15,23,42,.06) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        /* Scroll reveal */
        .rv { opacity: 0; transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1), filter .8s ease; will-change: transform, opacity; }
        .rv-up { transform: translateY(36px); filter: blur(4px); }
        .rv-left { transform: translateX(-40px); filter: blur(4px); }
        .rv-right { transform: translateX(40px); filter: blur(4px); }
        .rv-zoom { transform: scale(.94); filter: blur(4px); }
        .rv.in { opacity: 1; transform: none; filter: none; }

        /* Bars that fill when revealed */
        .ts-bar { width: 0; transition: width 1.3s cubic-bezier(.2,.7,.2,1) .3s; }
        .in .ts-bar, .ts-bar.ts-bar-now { width: var(--w); }

        /* Cursor spotlight cards */
        .ts-spot { position: relative; }
        .ts-spot::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit; opacity: 0;
          transition: opacity .3s; pointer-events: none; z-index: 1;
          background: radial-gradient(420px circle at var(--mx,50%) var(--my,50%), var(--spot, rgba(99,102,241,.13)), transparent 45%);
        }
        .ts-spot:hover::before { opacity: 1; }

        /* Parallax layers (set by HeroParallax) */
        .ts-par { transition: transform .25s ease-out; }

        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .ts-plus { transform: rotate(45deg); background: #4f46e5; color: #fff; }
        details[open] { background: rgba(238,242,255,.45); }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .ts-marquee, .ts-marquee-rev, .ts-float, .ts-float-slow, .ts-rise, .ts-pulse,
          .ts-aurora, .ts-aurora-b, .ts-grad-text, .ts-bob { animation: none !important; }
          .rv { opacity: 1 !important; transform: none !important; filter: none !important; transition: none !important; }
          .ts-bar { width: var(--w) !important; transition: none !important; }
        }
      `}</style>

      {/* ───────────── Nav ───────────── */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] px-3 sm:px-4 h-14">
          <Link href="/" className="flex items-center gap-2.5 pl-1">
            <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-slate-900 to-indigo-700 text-white grid place-items-center text-sm font-extrabold">
              T
            </span>
            <span className="text-[17px] font-bold tracking-tight">
              TalentSync
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            {[
              ["Find jobs", "/jobs"],
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
              className="ts-btn-shine text-sm font-semibold px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-indigo-600 transition inline-flex items-center gap-1.5"
            >
              Get started <Icon name="arrow" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <HeroParallax className="relative">
          <div className="ts-grid pointer-events-none absolute inset-0" />

          {/* Aurora blobs */}
          <div
            className="ts-par pointer-events-none absolute -top-40 left-1/2 -ml-[450px] w-[900px] h-[500px]"
            style={{
              transform:
                "translate(calc(var(--px,0) * 50px), calc(var(--py,0) * 30px))",
            }}
          >
            <div className="ts-aurora w-full h-full rounded-full bg-gradient-to-r from-indigo-300/50 via-violet-300/50 to-fuchsia-200/50 blur-3xl" />
          </div>
          <div
            className="ts-par pointer-events-none absolute top-40 -left-24 w-[380px] h-[380px]"
            style={{
              transform:
                "translate(calc(var(--px,0) * -40px), calc(var(--py,0) * -30px))",
            }}
          >
            <div className="ts-aurora-b w-full h-full rounded-full bg-sky-200/50 blur-3xl" />
          </div>
          <div
            className="ts-par pointer-events-none absolute top-24 -right-24 w-[360px] h-[360px]"
            style={{
              transform:
                "translate(calc(var(--px,0) * 45px), calc(var(--py,0) * 25px))",
            }}
          >
            <div className="ts-aurora w-full h-full rounded-full bg-pink-200/50 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
            <div className="max-w-3xl mx-auto text-center">
              <Link
                href="/jobs"
                className="ts-rise inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/90 pl-2 pr-4 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:border-indigo-300 hover:shadow-md transition"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold">
                  <span className="ts-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
                Explore jobs and internships from employers
                <Icon name="arrow" className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <h1
                className="ts-rise mt-7 text-[2.6rem] sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.035em] leading-[1.02] text-slate-950"
                style={{ animationDelay: "80ms" }}
              >
                Your next career move,{" "}
                <span
                  className={`${serif.className} ts-grad-text font-normal italic tracking-normal`}
                >
                  <RotatingWord words={["closer", "clearer", "open"]} />
                </span>{" "}
                to you.
              </h1>

              <p
                className="ts-rise mt-6 text-lg md:text-xl text-slate-600 leading-8 max-w-2xl mx-auto"
                style={{ animationDelay: "160ms" }}
              >
                Explore jobs and internships, apply with your profile, and
                follow every application from one workspace.
              </p>

              {/* Search */}
              <form
                action="/jobs"
                method="get"
                className="ts-rise mt-10 mx-auto max-w-3xl rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.35)] flex flex-col sm:flex-row gap-1.5 text-left focus-within:shadow-[0_24px_70px_-18px_rgba(79,70,229,0.5)] focus-within:border-indigo-200 transition"
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
                  className="ts-btn-shine px-7 py-3.5 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-indigo-600 transition inline-flex items-center justify-center gap-2"
                >
                  Search <Icon name="arrow" className="w-4 h-4" />
                </button>
              </form>

              <div
                className="ts-rise mt-6 flex flex-wrap items-center justify-center gap-2 text-sm"
                style={{ animationDelay: "320ms" }}
              >
                <span className="text-slate-500 mr-1">Trending:</span>
                {[
                  "AI Engineer",
                  "React Developer",
                  "Product Manager",
                  "Data Analyst",
                  "Remote",
                ].map((t) => (
                  <Link
                    key={t}
                    href={"/jobs?q=" + encodeURIComponent(t)}
                    className="px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-white hover:-translate-y-0.5 transition"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-12 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
              Illustrative workspace preview
            </p>
            {/* Hero visual: floating product cards with parallax */}
            <div
              className="ts-rise relative mt-16 md:mt-20 hidden md:block h-[340px] max-w-4xl mx-auto"
              style={{ animationDelay: "420ms" }}
            >
              {/* Job card */}
              <div
                className="ts-par absolute left-0 top-6"
                style={{
                  transform:
                    "translate(calc(var(--px,0) * -22px), calc(var(--py,0) * -14px))",
                }}
              >
                <div
                  className="ts-float w-[320px] rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] p-5"
                  style={{ ["--r" as string]: "-3deg" }}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 grid place-items-center font-bold">
                      R
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-tight">
                        Senior Frontend Developer
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Razorpay · Bengaluru
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-1">
                      96%
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Hybrid", "Full-time", "₹28L – ₹42L"].map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 h-10 rounded-xl bg-slate-950 text-white text-sm font-semibold grid place-items-center">
                    Quick apply
                  </div>
                </div>
              </div>

              {/* Workspace preview */}
              <div
                className="ts-par absolute left-1/2 -ml-[145px] top-0"
                style={{
                  transform:
                    "translate(calc(var(--px,0) * 14px), calc(var(--py,0) * 10px))",
                }}
              >
                <div className="ts-float-slow w-[290px] rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                    Profile ready
                  </p>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight">
                    Ready
                  </p>
                  <p className="text-sm text-indigo-100 mt-1">
                    Your profile goes with every application
                  </p>
                  <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="ts-bar ts-bar-now h-full rounded-full bg-white"
                      style={{ ["--w" as string]: "100%" }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Node.js"].map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium bg-white/15 rounded-full px-2.5 py-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracker */}
              <div
                className="ts-par absolute right-0 top-10"
                style={{
                  transform:
                    "translate(calc(var(--px,0) * 26px), calc(var(--py,0) * 16px))",
                }}
              >
                <div
                  className="ts-float w-[300px] rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] p-5"
                  style={{ ["--r" as string]: "3deg", animationDelay: "-2s" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Application status
                  </p>
                  <ol className="mt-4 space-y-3.5">
                    {[
                      { label: "Submitted", done: true },
                      { label: "Under review", done: true },
                      {
                        label: "Interview scheduled",
                        done: false,
                        active: true,
                      },
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
                          {s.done ? (
                            <Icon name="check" className="w-3 h-3" />
                          ) : s.active ? (
                            <span className="w-2 h-2 rounded-full bg-indigo-500 ts-pulse" />
                          ) : null}
                        </span>
                        <span
                          className={`text-sm ${
                            s.done
                              ? "font-medium text-slate-900"
                              : s.active
                                ? "font-semibold text-indigo-700"
                                : "text-slate-400"
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

            {/* Scroll cue */}
            <div className="hidden md:flex justify-center mt-4">
              <a
                href="#why"
                aria-label="Scroll down"
                className="ts-bob flex flex-col items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-600 transition"
              >
                Scroll to explore
                <svg className="w-4 h-4" {...base}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>
        </HeroParallax>
      </section>

      {/* ───────────── Logo marquee (two rows, opposite directions) ───────────── */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-12">
          <Reveal>
            <p className="text-center text-sm font-medium text-slate-500">
              Explore different fields and find your next direction
            </p>
          </Reveal>
          <div
            className="mt-8 space-y-5 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            }}
          >
            <div className="ts-marquee flex w-max gap-14 pr-14">
              {[...COMPANIES, ...COMPANIES].map((c, i) => (
                <span
                  key={c + i}
                  className="text-2xl font-bold tracking-tight text-slate-300 hover:text-slate-900 transition whitespace-nowrap"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="ts-marquee-rev flex w-max gap-14 pr-14">
              {[...COMPANIES_B, ...COMPANIES_B].map((c, i) => (
                <span
                  key={c + i}
                  className="text-2xl font-bold tracking-tight text-slate-200 hover:text-slate-900 transition whitespace-nowrap"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Bento: why TalentSync ───────────── */}
      <section id="why" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>Why TalentSync</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              A job search that respects{" "}
              <span
                className={`${serif.className} ts-grad-text font-normal italic`}
              >
                your time.
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(0,1fr)]">
            {/* Big: match */}
            <Reveal className="md:col-span-4" variant="left">
              <SpotlightCard
                spot="rgba(129,140,248,.22)"
                className="h-full relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 md:p-10 min-h-[320px]"
              >
                <div className="ts-aurora pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl" />
                <span className="relative inline-grid place-items-center w-11 h-11 rounded-xl bg-white/10 text-indigo-200">
                  <Icon name="spark" />
                </span>
                <h3 className="relative mt-6 text-2xl md:text-3xl font-bold tracking-tight max-w-md">
                  Your skills, your next opportunity
                </h3>
                <p className="relative mt-3 text-slate-300 max-w-md leading-7">
                  Compare the skills, experience, and location on each job
                  before you apply. Your profile stays ready for every
                  opportunity.
                </p>
                <div className="relative mt-8 space-y-3 max-w-md">
                  {[
                    ["Senior Frontend Dev", 96],
                    ["Staff Engineer", 91],
                    ["Tech Lead", 88],
                  ].map(([r, m]) => (
                    <div
                      key={r as string}
                      className="rounded-xl bg-white/[0.07] border border-white/10 px-4 py-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{r}</span>
                        <span className="text-xs font-bold text-emerald-300">
                          {m}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="ts-bar h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-300"
                          style={{ ["--w" as string]: `${m}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>

            {/* Salary */}
            <Reveal className="md:col-span-2" variant="right" delay={100}>
              <SpotlightCard
                spot="rgba(251,191,36,.18)"
                className="h-full rounded-3xl border border-slate-200 bg-white p-8 hover:border-amber-200 hover:-translate-y-1 transition"
              >
                <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600">
                  <Icon name="rupee" />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight">
                  Salary shown upfront
                </h3>
                <p className="mt-2 text-slate-600 leading-7 text-[15px]">
                  See the salary employers provide before you apply.
                </p>
                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">
                    Product Manager · Hyderabad
                  </p>
                  <p className="mt-1 font-extrabold text-xl tracking-tight">
                    ₹30L – ₹48L
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>

            {/* Verified */}
            <Reveal className="md:col-span-2" delay={80}>
              <SpotlightCard
                spot="rgba(16,185,129,.15)"
                className="h-full rounded-3xl border border-slate-200 bg-white p-8 hover:border-emerald-200 hover:-translate-y-1 transition"
              >
                <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon name="shield" />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight">
                  Company profiles
                </h3>
                <p className="mt-2 text-slate-600 leading-7 text-[15px]">
                  Employers create a company profile before publishing
                  opportunities.
                </p>
              </SpotlightCard>
            </Reveal>

            {/* One-click */}
            <Reveal className="md:col-span-2" delay={160}>
              <SpotlightCard className="h-full rounded-3xl border border-slate-200 bg-white p-8 hover:border-indigo-200 hover:-translate-y-1 transition">
                <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon name="bolt" />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight">
                  One-click apply
                </h3>
                <p className="mt-2 text-slate-600 leading-7 text-[15px]">
                  Your profile does the heavy lifting. Apply in seconds and
                  follow every step.
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Stat */}
            <Reveal className="md:col-span-2" variant="zoom" delay={240}>
              <div className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 flex flex-col justify-between min-h-[200px]">
                <div className="pointer-events-none absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
                <p className="text-sm font-semibold text-indigo-200">
                  Application stages
                </p>
                <div>
                  <p className="text-6xl font-extrabold tracking-tight">
                    <CountUp to={6} suffix="" />
                  </p>
                  <p className="mt-2 text-indigo-100 text-[15px]">
                    from application to a hiring decision
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Categories ───────────── */}
      <section id="categories" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Eyebrow>Browse by field</Eyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                Roles in every discipline
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-indigo-600 transition"
            >
              View all categories <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map((c, i) => (
              <Reveal
                key={c.name}
                variant="zoom"
                delay={(i % 4) * 80 + Math.floor(i / 4) * 120}
              >
                <Link href="/jobs" className="block h-full">
                  <SpotlightCard className="group h-full rounded-2xl border border-slate-200 bg-white p-5 md:p-6 hover:border-slate-900 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.3)] transition overflow-hidden">
                    <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition">
                      <Icon name={c.icon} />
                    </span>
                    <h3 className="mt-5 font-bold tracking-tight">{c.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Explore opportunities
                    </p>
                    <span className="absolute top-5 right-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition">
                      <Icon name="arrow" className="w-4 h-4" />
                    </span>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Featured jobs ───────────── */}
      <section className="py-24 md:py-32 bg-white border-y border-slate-200/70 relative overflow-hidden">
        <div className="ts-noise pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Eyebrow>Featured roles</Eyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                Fresh openings,{" "}
                <span
                  className={`${serif.className} ts-grad-text font-normal italic`}
                >
                  ready to explore
                </span>
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-indigo-600 transition"
            >
              See all jobs <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </Reveal>

          <div className="mt-12">
            <FeaturedJobs />
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section id="how" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="max-w-2xl mx-auto text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              From signup to offer in three steps
            </h2>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-3 gap-5 relative">
            {/* connecting line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 150}>
                <SpotlightCard className="relative h-full rounded-3xl border border-slate-200 bg-white p-8 hover:-translate-y-1.5 hover:border-indigo-200 transition">
                  <span className="relative inline-grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-slate-900 to-indigo-700 text-white text-sm font-bold ring-8 ring-white">
                    {s.n}
                  </span>
                  <h3 className="mt-6 text-xl font-bold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-7">{s.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Testimonials ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>One connected journey</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              Built for{" "}
              <span
                className={`${serif.className} ts-grad-text font-normal italic`}
              >
                both sides of hiring.
              </span>
            </h2>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {USE_CASES.map((t, i) => (
              <Reveal key={t.name} delay={i * 120} className="h-full">
                <SpotlightCard className="h-full">
                  <figure className="h-full rounded-3xl border border-slate-200 bg-white p-8 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)] transition">
                    <p className="mt-5 text-[17px] leading-8 text-slate-800 flex-1">
                      {t.quote}
                    </p>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-full grid place-items-center text-sm font-bold ${t.color}`}
                      >
                        {t.initials}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">
                          {t.name}
                        </span>
                        <span className="block text-sm text-slate-500">
                          {t.role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Employers ───────────── */}
      <section id="employers" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal variant="zoom">
            <div className="relative overflow-hidden rounded-[32px] bg-slate-950 text-white">
              <div className="ts-aurora pointer-events-none absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl" />
              <div className="ts-aurora-b pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-violet-600/30 blur-3xl" />

              <div className="relative grid lg:grid-cols-2 gap-12 p-8 md:p-14 items-center">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300">
                    <span className="h-px w-6 bg-indigo-400" />
                    For employers
                  </p>
                  <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                    Hire great people,{" "}
                    <span
                      className={`${serif.className} font-normal italic text-indigo-300`}
                    >
                      faster.
                    </span>
                  </h2>
                  <p className="mt-5 text-slate-300 text-lg leading-8 max-w-lg">
                    Post a role in minutes, review applicant profiles and manage
                    your whole pipeline from one dashboard.
                  </p>
                  <ul className="mt-8 space-y-3.5">
                    {[
                      "Go live instantly, no sales call needed",
                      "Applicant profiles, resumes, and interview scheduling",
                      "Simple pipeline from review to offer",
                    ].map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-3 text-slate-200"
                      >
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
                      className="ts-btn-shine px-7 py-3.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-indigo-50 transition inline-flex items-center gap-2"
                    >
                      Post a job <Icon name="arrow" className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/auth/register?role=RECRUITER"
                      className="px-7 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition"
                    >
                      Create employer account
                    </Link>
                  </div>
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 lg:hidden">
                  Example hiring pipeline
                </p>
                {/* Pipeline mock */}
                <div className="ts-float-slow rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Senior Frontend Developer</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 rounded-full px-2.5 py-1">
                      <span className="ts-pulse w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    {[
                      [148, "Applicants"],
                      [32, "Shortlisted"],
                      [6, "Interviews"],
                    ].map(([n, l]) => (
                      <div
                        key={l as string}
                        className="rounded-xl bg-white/[0.06] py-4"
                      >
                        <p className="text-2xl font-extrabold">
                          <CountUp to={n as number} />
                        </p>
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
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-xl bg-white/[0.06] px-4 py-3 hover:bg-white/[0.1] transition"
                      >
                        <span className="flex items-center gap-3 text-sm">
                          <span className="w-8 h-8 rounded-full bg-indigo-500/30 grid place-items-center text-xs font-bold">
                            {name[0]}
                          </span>
                          {name}
                        </span>
                        <span className="text-xs font-bold text-emerald-300">
                          {m} match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Stats ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 text-center divide-x-0 md:divide-x divide-slate-200">
            {[
              [1, "", "Profile for every application"],
              [2, "", "Connected workspaces"],
              [6, "", "Application stages"],
              [0, "", "Signup fees"],
            ].map(([n, suf, l], i) => (
              <Reveal key={l as string} delay={i * 100}>
                <p className="ts-grad-text text-4xl md:text-6xl font-extrabold tracking-[-0.04em]">
                  <CountUp to={n as number} suffix={suf as string} />
                </p>
                <p className="mt-2 text-slate-500">{l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal className="text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
              Questions, answered
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-12 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white overflow-hidden">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group px-6 md:px-8 py-5 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-6 cursor-pointer font-semibold text-[17px]">
                    {f.q}
                    <span className="ts-plus shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 grid place-items-center transition-all duration-300">
                      <Icon name="plus" className="w-4 h-4" />
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 leading-7 pr-12">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal variant="zoom">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-8 py-16 md:px-16 md:py-24 text-center">
              <div className="ts-aurora pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10" />
              <div className="ts-aurora-b pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10" />
              <h2 className="relative text-3xl md:text-6xl font-extrabold tracking-[-0.035em] text-white leading-[1.04]">
                Your next role is{" "}
                <span className={`${serif.className} font-normal italic`}>
                  one click
                </span>{" "}
                away.
              </h2>
              <p className="relative mt-5 text-indigo-100 text-lg max-w-xl mx-auto">
                Create your free profile in minutes and let great opportunities
                find you.
              </p>
              <div className="relative mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="ts-btn-shine px-8 py-4 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 hover:-translate-y-0.5 transition inline-flex items-center gap-2"
                >
                  Create free account <Icon name="arrow" className="w-4 h-4" />
                </Link>
                <Link
                  href="/jobs"
                  className="px-8 py-4 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition"
                >
                  Browse jobs
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-slate-900 to-indigo-700 text-white grid place-items-center text-sm font-extrabold">
                T
              </span>
              <span className="text-[17px] font-bold tracking-tight">
                TalentSync
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500 max-w-xs leading-6">
              Connecting professionals with great companies across India, in
              real time.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">For candidates</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/jobs" className="hover:text-slate-900">
                  Browse jobs
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-slate-900">
                  Create profile
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-slate-900">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold">For employers</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/jobposts/create" className="hover:text-slate-900">
                  Post a job
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-slate-900">
                  Hire talent
                </Link>
              </li>
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
