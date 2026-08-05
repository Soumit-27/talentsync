"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  CalendarCheck,
  UserCheck,
  Plus,
  LogOut,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import { getLoginUser, GetLoginUserResponse } from "../services/auth";
import { useMutation } from "@tanstack/react-query";

// ---------- design tokens ----------
const T = {
  ink: "#16213D",
  paper: "#F6F5F1",
  card: "#FFFFFF",
  teal: "#12836F",
  tealSoft: "#E3F1EC",
  amber: "#E2A33B",
  amberSoft: "#FBF0DC",
  coral: "#E2624F",
  coralSoft: "#FBE8E4",
  line: "#E4E2DA",
  sub: "#6B7075",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
    .ts-app { font-family: 'Inter', ui-sans-serif, system-ui; }
    .ts-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
  `}</style>
);

// seed data - swap this out for your real API / DB call
const seedJobs = [
  {
    id: "j1",
    title: "Frontend Developer",
    stack: "React - TypeScript",
    location: "Mumbai (Hybrid)",
    status: "Active",
    applicants: [
      {
        id: "a1",
        name: "Priya Nair",
        email: "priya.n@example.com",
        stage: "Interview",
      },
      {
        id: "a2",
        name: "Arjun Mehta",
        email: "arjun.m@example.com",
        stage: "Applied",
      },
    ],
  },
  {
    id: "j2",
    title: "Backend Developer",
    stack: "Node.js - PostgreSQL",
    location: "Bengaluru (Remote)",
    status: "Active",
    applicants: [
      {
        id: "a3",
        name: "Kavya Rao",
        email: "kavya.r@example.com",
        stage: "Review",
      },
    ],
  },
  {
    id: "j3",
    title: "Full Stack Developer",
    stack: "Next.js - Node.js",
    location: "Pune (On-site)",
    status: "Pending",
    applicants: [],
  },
];

const STAGES = ["Applied", "Review", "Interview", "Hired"];

function stageColor(stage) {
  if (stage === "Hired") return { bg: T.tealSoft, fg: T.teal };
  if (stage === "Interview") return { bg: T.amberSoft, fg: "#8a5a10" };
  if (stage === "Review") return { bg: "#EAEAF5", fg: "#4A4A8A" };
  return { bg: "#EEF0F2", fg: T.sub };
}

function Avatar({ name, tone = T.ink }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: tone,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function StagePill({ stage }) {
  const c = stageColor(stage);
  return (
    <span
      style={{
        background: c.bg,
        color: c.fg,
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 999,
      }}
    >
      {stage}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  style,
  type = "button",
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    padding: "10px 18px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    transition: "transform .1s ease",
  };
  const variants = {
    primary: { background: T.ink, color: "#fff" },
    accent: { background: T.teal, color: "#fff" },
    ghost: {
      background: "transparent",
      color: T.ink,
      border: `1px solid ${T.line}`,
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: T.ink,
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <input
        {...props}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          border: `1px solid ${T.line}`,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          background: "#fff",
        }}
      />
    </label>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.line}`,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <p style={{ color: T.sub, fontSize: 13, fontWeight: 600, margin: 0 }}>
          {label}
        </p>
        <Icon size={18} color={tone} />
      </div>
      <h3
        className="ts-display"
        style={{
          fontSize: 32,
          fontWeight: 700,
          margin: "10px 0 0",
          color: T.ink,
        }}
      >
        {value}
      </h3>
    </div>
  );
}

// ---------- main export ----------
// Drop this into your existing dashboard route. Pass the logged-in
// recruiter's name/email as `user` (from your own auth/session), e.g:
//   <RecruiterDashboard user={{ name: session.user.name }} onLogout={signOut} />
export default function RecruiterDashboard({
  user = { name: "Sonali" },
  onLogout,
}) {
  const [jobs, setJobs] = useState(seedJobs);
  const [showForm, setShowForm] = useState(false);
  const [openJob, setOpenJob] = useState(null);
  const [form, setForm] = useState({ title: "", stack: "", location: "" });
  const [section, setSection] = useState("dashboard");
  const [loginUser, setLoginUser] = useState<
    GetLoginUserResponse["user"] | null
  >(null);

  const getUserMutation = useMutation({
    mutationFn: getLoginUser,

    onSuccess: (data) => {
      console.log(data);

      setLoginUser(data.user);
    },

    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    getUserMutation.mutate();
  }, []);

  const totalApplicants = jobs.reduce((s, j) => s + j.applicants.length, 0);
  const interviews = jobs.reduce(
    (s, j) => s + j.applicants.filter((a) => a.stage === "Interview").length,
    0,
  );
  const hired = jobs.reduce(
    (s, j) => s + j.applicants.filter((a) => a.stage === "Hired").length,
    0,
  );

  function createJob(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const job = {
      id: "j" + Date.now(),
      title: form.title,
      stack: form.stack || "Not specified",
      location: form.location || "Not specified",
      status: "Active",
      applicants: [],
    };
    setJobs([job, ...jobs]);
    setForm({ title: "", stack: "", location: "" });
    setShowForm(false);
  }

  function advanceStage(jobId, appId) {
    setJobs(
      jobs.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          applicants: j.applicants.map((a) => {
            if (a.id !== appId) return a;
            const idx = STAGES.indexOf(a.stage);
            const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
            return { ...a, stage: next };
          }),
        };
      }),
    );
  }

  const Shell = ({ children }) => (
    <div style={{ minHeight: "100vh", background: T.paper }} className="ts-app">
      {FONTS}
      <header
        style={{
          height: 64,
          background: T.card,
          borderBottom: `1px solid ${T.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <h1
          className="ts-display"
          style={{ fontSize: 22, fontWeight: 700, color: T.ink, margin: 0 }}
        >
          TalentSync
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <p
              style={{ fontWeight: 600, color: T.ink, margin: 0, fontSize: 14 }}
            >
              {loginUser?.name}
            </p>
            <p style={{ fontSize: 12, color: T.sub, margin: 0 }}>Recruiter</p>
          </div>
          <Avatar name={loginUser?.name || ""} tone={T.teal} />
          {onLogout && (
            <button
              onClick={onLogout}
              title="Log out"
              style={{
                background: "none",
                border: "none",
                color: T.sub,
                cursor: "pointer",
              }}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </header>
    
    </div>
  );

  function ComingSoon({ label }) {
    return (
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.line}`,
          borderRadius: 16,
          padding: 48,
          textAlign: "center",
        }}
      >
        <h3
          className="ts-display"
          style={{ fontSize: 20, color: T.ink, margin: "0 0 6px" }}
        >
          {label}
        </h3>
        <p style={{ color: T.sub, margin: 0, fontSize: 14 }}>
          This section is coming soon.
        </p>
      </div>
    );
  }

  if (section === "candidates")
    return (
      <Shell>
        <ComingSoon label="Candidates" />
      </Shell>
    );
  if (section === "interviews")
    return (
      <Shell>
        <ComingSoon label="Interviews" />
      </Shell>
    );
  if (section === "settings")
    return (
      <Shell>
        <ComingSoon label="Settings" />
      </Shell>
    );

  if (openJob) {
    const job = jobs.find((j) => j.id === openJob);
    return (
      <Shell>
        <button
          onClick={() => setOpenJob(null)}
          style={{
            background: "none",
            border: "none",
            color: T.sub,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <h2
          className="ts-display"
          style={{ fontSize: 30, color: T.ink, margin: "0 0 4px" }}
        >
          {job.title}
        </h2>
        <p style={{ color: T.sub, marginBottom: 24 }}>
          {job.stack} - {job.location}
        </p>
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.line}`,
            borderRadius: 16,
            padding: 8,
          }}
        >
          {job.applicants.length === 0 && (
            <p style={{ color: T.sub, padding: 20, textAlign: "center" }}>
              No applicants yet for this role.
            </p>
          )}
          {job.applicants.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 16px",
                borderBottom:
                  i < job.applicants.length - 1
                    ? `1px solid ${T.line}`
                    : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={a.name} />
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      color: T.ink,
                      fontSize: 14,
                    }}
                  >
                    {a.name}
                  </p>
                  <p style={{ margin: 0, color: T.sub, fontSize: 13 }}>
                    {a.email}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <StagePill stage={a.stage} />
                {a.stage !== "Hired" && (
                  <Button
                    variant="ghost"
                    onClick={() => advanceStage(job.id, a.id)}
                  >
                    Move to {STAGES[STAGES.indexOf(a.stage) + 1]}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 28,
        }}
      >
        <div>
          <h2
            className="ts-display"
            style={{ fontSize: 32, fontWeight: 700, color: T.ink, margin: 0 }}
          >
            Dashboard
          </h2>
          <p style={{ color: T.sub, marginTop: 6 }}>
            Welcome back, {loginUser?.name?.split(" ")[0]}
          </p>
        </div>
        <Button variant="accent" icon={Plus} onClick={() => setShowForm(true)}>
          Post a job
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total jobs"
          value={jobs.length}
          icon={Briefcase}
          tone={T.teal}
        />
        <StatCard
          label="Applicants"
          value={totalApplicants}
          icon={Users}
          tone={T.amber}
        />
        <StatCard
          label="Interviews"
          value={interviews}
          icon={CalendarCheck}
          tone={T.coral}
        />
        <StatCard label="Hired" value={hired} icon={UserCheck} tone={T.teal} />
      </div>

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.line}`,
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h3
          className="ts-display"
          style={{ fontSize: 19, margin: "0 0 16px", color: T.ink }}
        >
          Job openings
        </h3>
        {jobs.map((job, i) => (
          <div
            key={job.id}
            onClick={() => setOpenJob(job.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 4px",
              borderBottom:
                i < jobs.length - 1 ? `1px solid ${T.line}` : "none",
              cursor: "pointer",
            }}
          >
            <div>
              <h4
                style={{
                  margin: 0,
                  fontWeight: 600,
                  color: T.ink,
                  fontSize: 15,
                }}
              >
                {job.title}
              </h4>
              <p style={{ margin: "4px 0 0", color: T.sub, fontSize: 13 }}>
                {job.stack} - {job.location}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 13, color: T.sub }}>
                {job.applicants.length} applicant
                {job.applicants.length === 1 ? "" : "s"}
              </span>
              <span
                style={{
                  background:
                    job.status === "Active" ? T.tealSoft : T.amberSoft,
                  color: job.status === "Active" ? T.teal : "#8a5a10",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 999,
                }}
              >
                {job.status}
              </span>
              <ChevronRight size={16} color={T.sub} />
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(22,33,61,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: T.card,
              borderRadius: 18,
              padding: 28,
              width: 420,
              maxWidth: "90vw",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h3
                className="ts-display"
                style={{ margin: 0, fontSize: 20, color: T.ink }}
              >
                Post a job
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.sub,
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={createJob}>
              <Field
                label="Job title"
                placeholder="e.g. UI Designer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Field
                label="Skills / stack"
                placeholder="e.g. Figma - Design systems"
                value={form.stack}
                onChange={(e) => setForm({ ...form, stack: e.target.value })}
              />
              <Field
                label="Location"
                placeholder="e.g. Mumbai (Hybrid)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <Button
                type="submit"
                variant="accent"
                style={{ width: "100%", marginTop: 4 }}
              >
                Publish job
              </Button>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
