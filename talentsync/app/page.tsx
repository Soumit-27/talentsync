import Link from "next/link";

const BOARD_ROWS = [
  {
    code: "TS 204",
    entries: [
      { city: "Bengaluru", role: "Frontend Developer", type: "Full-time", status: "BOARDING" },
      { city: "Hyderabad", role: "Backend Engineer", type: "Full-time", status: "OPEN" },
      { city: "Remote", role: "UI Designer", type: "Contract", status: "OPEN" },
    ],
  },
  {
    code: "TS 117",
    entries: [
      { city: "Pune", role: "Data Analyst", type: "Full-time", status: "OPEN" },
      { city: "Mumbai", role: "Product Manager", type: "Full-time", status: "BOARDING" },
      { city: "Chennai", role: "DevOps Engineer", type: "Full-time", status: "CLOSING" },
    ],
  },
  {
    code: "TS 356",
    entries: [
      { city: "Gurugram", role: "Marketing Lead", type: "Full-time", status: "OPEN" },
      { city: "Bengaluru", role: "iOS Developer", type: "Full-time", status: "BOARDING" },
      { city: "Remote", role: "Content Writer", type: "Part-time", status: "OPEN" },
    ],
  },
  {
    code: "TS 482",
    entries: [
      { city: "Noida", role: "QA Engineer", type: "Full-time", status: "OPEN" },
      { city: "Kolkata", role: "Sales Executive", type: "Full-time", status: "OPEN" },
      { city: "Hyderabad", role: "ML Engineer", type: "Full-time", status: "BOARDING" },
    ],
  },
  {
    code: "TS 093",
    entries: [
      { city: "Ahmedabad", role: "HR Manager", type: "Full-time", status: "OPEN" },
      { city: "Remote", role: "Customer Success", type: "Full-time", status: "OPEN" },
      { city: "Pune", role: "Cloud Architect", type: "Full-time", status: "CLOSING" },
    ],
  },
];

const FEATURES = [
  {
    code: "TS-SEARCH",
    title: "Every open role, one runway",
    body: "Verified listings from startups and top companies, filtered by city, salary, and skill so you never taxi through noise.",
  },
  {
    code: "TS-APPLY",
    title: "One profile. Every gate.",
    body: "Build your profile once and apply in a single tap. No repeat forms, no lost paperwork, no missed departures.",
  },
  {
    code: "TS-TRACK",
    title: "Track the whole journey",
    body: "Follow every application from submitted to offer, with real status updates instead of radio silence.",
  },
];

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    BOARDING: "text-[#F5A623] border-[#F5A623]/40 bg-[#F5A623]/10",
    OPEN: "text-[#3FC1C9] border-[#3FC1C9]/40 bg-[#3FC1C9]/10",
    CLOSING: "text-[#EF6461] border-[#EF6461]/40 bg-[#EF6461]/10",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded border text-[11px] tracking-widest ${styles[status]}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {status}
    </span>
  );
}

export default function Home() {
  return (
    <main style={{ fontFamily: "var(--font-body)", color: "#1A2233", background: "#F6F7F9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
        }

        .ts-board-wrap { perspective: 600px; }

        .ts-flap-stack {
          position: relative;
          height: 1.4em;
        }

        .ts-flap-item {
          position: absolute;
          inset: 0;
          transform-origin: 50% 50%;
          animation: tsFlap 9s infinite;
          will-change: opacity, transform;
        }

        @keyframes tsFlap {
          0%   { opacity: 0; transform: rotateX(80deg); }
          2%   { opacity: 1; transform: rotateX(0deg); }
          30%  { opacity: 1; transform: rotateX(0deg); }
          33%  { opacity: 0; transform: rotateX(-80deg); }
          100% { opacity: 0; transform: rotateX(80deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ts-flap-item { animation: none !important; opacity: 1 !important; transform: none !important; }
          .ts-flap-item:not(:first-child) { display: none; }
        }

        .ts-perf {
          background-image: radial-gradient(circle, #C8CDD6 1.5px, transparent 1.5px);
          background-size: 10px 10px;
        }
      `}</style>

      {/* Nav */}
      <nav className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: "rgba(14,21,38,0.92)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-9 h-9 rounded text-sm font-bold"
              style={{ background: "#F5A623", color: "#0E1526", fontFamily: "var(--font-mono)" }}
            >
              TS
            </span>
            <span className="text-lg font-semibold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              TalentSync
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold px-4 py-2 rounded transition"
              style={{ background: "#F5A623", color: "#0E1526" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "#0E1526" }} className="relative overflow-hidden">
        <div className="ts-perf absolute inset-0 opacity-[0.06] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-20 relative">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 text-[12px] tracking-widest px-3 py-1 rounded-full border"
              style={{ fontFamily: "var(--font-mono)", color: "#3FC1C9", borderColor: "rgba(63,193,201,0.35)", background: "rgba(63,193,201,0.08)" }}
            >
              NOW BOARDING · INDIA
            </span>

            <h1
              className="mt-6 text-4xl md:text-6xl font-semibold leading-[1.05] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your next opportunity
              <br />
              is <span style={{ color: "#F5A623" }}>boarding.</span>
            </h1>

            <p className="mt-6 text-lg leading-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              TalentSync connects professionals with companies across India in real time.
              Search thousands of roles, apply in one tap, and track every application to the gate.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="px-7 py-3.5 rounded font-semibold transition hover:brightness-110"
                style={{ background: "#F5A623", color: "#0E1526" }}
              >
                Browse open roles
              </Link>
              <Link
                href="/register"
                className="px-7 py-3.5 rounded font-semibold border transition hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}
              >
                Create free account
              </Link>
            </div>
          </div>

          {/* Departures board */}
          <div className="ts-board-wrap mt-14 rounded-xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#141D33" }}>
            <div
              className="flex items-center justify-between px-5 py-3 border-b text-[11px] tracking-widest"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-mono)" }}
            >
              <span>OPPORTUNITIES · DEPARTURES</span>
              <span className="hidden sm:inline">UPDATED LIVE</span>
            </div>

            <div className="grid grid-cols-[70px_1fr_1.4fr_1fr_1fr] gap-2 px-5 py-2 text-[11px] tracking-widest border-b" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)" }}>
              <span>NO.</span>
              <span>CITY</span>
              <span>ROLE</span>
              <span>TYPE</span>
              <span className="text-right">STATUS</span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {BOARD_ROWS.map((row, i) => (
                <div
                  key={row.code}
                  className="grid grid-cols-[70px_1fr_1.4fr_1fr_1fr] gap-2 px-5 py-3 items-center"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <span className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>
                    {row.code}
                  </span>

                  {["city", "role", "type"].map((field) => (
                    <div key={field} className="ts-flap-stack">
                      {row.entries.map((entry, idx) => (
                        <span
                          key={idx}
                          className="ts-flap-item text-sm text-white truncate"
                          style={{ animationDelay: `${idx * 3}s`, fontFamily: field === "type" ? "var(--font-mono)" : "var(--font-body)" }}
                        >
                          {/* @ts-expect-error dynamic field lookup */}
                          {entry[field]}
                        </span>
                      ))}
                    </div>
                  ))}

                  <div className="ts-flap-stack flex justify-end">
                    {row.entries.map((entry, idx) => (
                      <span
                        key={idx}
                        className="ts-flap-item"
                        style={{ animationDelay: `${idx * 3}s` }}
                      >
                        <StatusPill status={entry.status} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            {[
              ["10K+", "Active roles"],
              ["5K+", "Companies"],
              ["50K+", "Candidates"],
            ].map(([n, label]) => (
              <div key={label}>
                <div className="text-2xl md:text-3xl font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {n}
                </div>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" style={{ background: "#F6F7F9" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-xl">
            <span className="text-[12px] tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "#0F8B8D" }}>
              WHY TALENTSYNC
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#0E1526" }}>
              Built to move you faster.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {FEATURES.map((f) => (
              <div key={f.code} className="p-7 rounded-xl border bg-white transition hover:shadow-lg" style={{ borderColor: "#E4E7EC" }}>
                <span
                  className="inline-block text-[11px] tracking-widest px-2.5 py-1 rounded"
                  style={{ fontFamily: "var(--font-mono)", background: "#0E1526", color: "#F5A623" }}
                >
                  {f.code}
                </span>
                <h3 className="text-xl font-semibold mt-5" style={{ fontFamily: "var(--font-display)", color: "#0E1526" }}>
                  {f.title}
                </h3>
                <p className="mt-3 leading-7" style={{ color: "#475569" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — boarding pass */}
      <section className="py-24" style={{ background: "#0E1526" }}>
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="rounded-2xl overflow-hidden flex flex-col sm:flex-row" style={{ background: "#F6F7F9" }}>
            <div className="flex-1 p-8 sm:p-10">
              <span className="text-[11px] tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "#0F8B8D" }}>
                BOARDING PASS
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#0E1526" }}>
                Ready when you are.
              </h2>
              <p className="mt-3" style={{ color: "#475569" }}>
                Create your profile and join thousands of professionals already on their way to a new role.
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="tracking-widest text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "#94A3B8" }}>PASSENGER</dt>
                  <dd className="mt-1 font-medium" style={{ color: "#0E1526" }}>You</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "#94A3B8" }}>DESTINATION</dt>
                  <dd className="mt-1 font-medium" style={{ color: "#0E1526" }}>Dream job</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "#94A3B8" }}>GATE</dt>
                  <dd className="mt-1 font-medium" style={{ color: "#0E1526" }}>Now open</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "#94A3B8" }}>SEAT</dt>
                  <dd className="mt-1 font-medium" style={{ color: "#0E1526" }}>Reserved</dd>
                </div>
              </dl>
            </div>

            <div
              className="sm:w-56 flex items-center justify-center p-8 border-t sm:border-t-0 sm:border-l border-dashed"
              style={{ borderColor: "#CBD2DC", background: "#0E1526" }}
            >
              <Link
                href="/register"
                className="w-full text-center px-5 py-3.5 rounded font-semibold transition hover:brightness-110"
                style={{ background: "#F5A623", color: "#0E1526" }}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ background: "#0E1526", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-white font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            TalentSync
          </span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)" }}>
            © 2026 TalentSync. All rights reserved.
          </span>
        </div>
      </footer>
    </main>
  );
}