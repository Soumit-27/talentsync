"use client";

import {
  useState,
  useEffect,
  ReactNode,
  CSSProperties,
  ComponentType,
} from "react";

import {
  Briefcase,
  Clock,
  CheckCircle2,
  Send,
  LogOut,
  ChevronRight,
  MapPin,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";

import { getLoginUser, GetLoginUserResponse } from "../services/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import ProtectedRoute from "../components/ProtectedRoute";

import { getAllJobs, Job } from "../services/jobpost";

import {
  getMyApplications,
  applyForJob,
  Application,
} from "../services/job_application";

import { useRouter } from "next/navigation";

/* =========================================================
   DESIGN TOKENS
========================================================= */

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

/* =========================================================
   FONTS
========================================================= */

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    .ts-app {
      font-family: 'Inter', ui-sans-serif, system-ui;
    }

    .ts-display {
      font-family: 'Space Grotesk', ui-sans-serif, system-ui;
    }
  `}</style>
);

/* =========================================================
   TYPES
========================================================= */

const STAGES = ["Applied", "Review", "Interview", "Hired"] as const;

type Stage = (typeof STAGES)[number];

type Section = "applications" | "browse" | "profile";

/* =========================================================
   OPEN JOB TYPE
========================================================= */

interface OpenJob {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  salary?: number;
  experience?: number;
  skills: string[];
  jobType: string;
  status: string;
  recruiterId: string;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   HELPERS
========================================================= */

function convertStatusToStage(status: string): Stage {
  switch (status) {
    case "APPLIED":
      return "Applied";

    case "SCREENING":
      return "Review";

    case "SHORTLISTED":
      return "Review";

    case "INTERVIEW":
      return "Interview";

    case "HIRED":
      return "Hired";

    case "REJECTED":
      return "Review";

    default:
      return "Applied";
  }
}

function stageColor(stage: Stage) {
  if (stage === "Hired") {
    return {
      bg: T.tealSoft,
      fg: T.teal,
    };
  }

  if (stage === "Interview") {
    return {
      bg: T.amberSoft,
      fg: "#8a5a10",
    };
  }

  if (stage === "Review") {
    return {
      bg: "#EAEAF5",
      fg: "#4A4A8A",
    };
  }

  return {
    bg: "#EEF0F2",
    fg: T.sub,
  };
}

function stageStepIndex(stage: Stage) {
  return STAGES.indexOf(stage);
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({ name, tone = T.ink }: { name: string; tone?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
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

/* =========================================================
   STAGE PILL
========================================================= */

function StagePill({ stage }: { stage: Stage }) {
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

/* =========================================================
   STAGE TRACKER
========================================================= */

function StageTracker({ stage }: { stage: Stage }) {
  const current = stageStepIndex(stage);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {STAGES.map((s, i) => {
        const done = i <= current;

        return (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              title={s}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: done ? T.teal : T.line,
              }}
            />

            {i < STAGES.length - 1 && (
              <div
                style={{
                  width: 22,
                  height: 2,
                  background: i < current ? T.teal : T.line,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   BUTTON
========================================================= */

type ButtonVariant = "primary" | "accent" | "ghost";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: ComponentType<{
    size?: number;
    color?: string;
  }>;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  style,
  type = "button",
  disabled,
}: ButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    padding: "10px 18px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled ? "default" : "pointer",
    border: "none",
    transition: "transform .1s ease",
    opacity: disabled ? 0.55 : 1,
  };

  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: T.ink,
      color: "#fff",
    },

    accent: {
      background: T.teal,
      color: "#fff",
    },

    ghost: {
      background: "transparent",
      color: T.ink,
      border: `1px solid ${T.line}`,
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...base,
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(0.97)";
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {Icon && <Icon size={16} />}

      {children}
    </button>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  label: string;
  value: number;
  icon: ComponentType<{
    size?: number;
    color?: string;
  }>;
  tone: string;
}

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
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
        <p
          style={{
            color: T.sub,
            fontSize: 13,
            fontWeight: 600,
            margin: 0,
          }}
        >
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

/* =========================================================
   PROPS
========================================================= */

interface CandidateDashboardProps {
  user?: {
    name: string;
  };

  onLogout?: () => void;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CandidateDashboard({
  user = {
    name: "Candidate",
  },
  onLogout,
}: CandidateDashboardProps) {
  /* =======================================================
     STATES
  ======================================================= */

  const [applications, setApplications] = useState<Application[]>([]);

  const [openJobs, setOpenJobs] = useState<OpenJob[]>([]);

  const [section, setSection] = useState<Section>("applications");

  const [query, setQuery] = useState("");

  const [openApp, setOpenApp] = useState<string | null>(null);

  const [confirmJob, setConfirmJob] = useState<OpenJob | null>(null);

  const [loginUser, setLoginUser] = useState<
    GetLoginUserResponse["user"] | null
  >(null);

  const [showProfile, setShowProfile] = useState(false);

  const hasApplied = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const router = useRouter();

  const queryClient = useQueryClient();

  /* =======================================================
     GET LOGIN USER
  ======================================================= */

  const getUserMutation = useMutation({
    mutationFn: getLoginUser,

    onSuccess: (data) => {
      console.log("Login User:", data);

      setLoginUser(data.user);
    },

    onError: (error) => {
      console.error("Failed to get user:", error);
    },
  });

  /* =======================================================
     GET ALL JOBS
  ======================================================= */

  const getJobsMutation = useMutation({
    mutationFn: getAllJobs,

    onSuccess: (data) => {
      console.log("Jobs:", data);

      setOpenJobs(data.data as OpenJob[]);
    },

    onError: (error) => {
      console.error("Failed to fetch jobs:", error);
    },
  });

  /* =======================================================
     GET MY APPLICATIONS
  ======================================================= */

  const getApplicationsMutation = useMutation({
    mutationFn: getMyApplications,

    onSuccess: (data) => {
      console.log("My Applications:", data);

      setApplications(data.data);
    },

    onError: (error: any) => {
      console.error("Failed to fetch applications:", error);
    },
  });

  /* =======================================================
     APPLY FOR JOB
  ======================================================= */

  const applyMutation = useMutation({
    mutationFn: applyForJob,

    onSuccess: (data) => {
      console.log("Application submitted:", data);

      setConfirmJob(null);

      // Refresh applications
      getApplicationsMutation.mutate();

      // Remove applied job from browse list
      if (data.data?.jobId) {
        setOpenJobs((prev) => prev.filter((job) => job.id !== data.data.jobId));
      }

      // Open My Applications
      setSection("applications");

      // Optional query invalidation
      queryClient.invalidateQueries({
        queryKey: ["my-applications"],
      });
    },

    onError: (error: any) => {
      console.error("Application failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to apply for this job";

      alert(message);
    },
  });

  /* =======================================================
     INITIAL API CALLS
  ======================================================= */

  useEffect(() => {
    getUserMutation.mutate();

    getJobsMutation.mutate();

    getApplicationsMutation.mutate();
  }, []);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const inProgress = applications.filter(
    (application) =>
      application.status !== "HIRED" && application.status !== "REJECTED",
  ).length;

  const interviewing = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

  const hired = applications.filter(
    (application) => application.status === "HIRED",
  ).length;

  /* =======================================================
     FILTER JOBS
  ======================================================= */

  const filteredJobs = openJobs.filter((job) => {
    const q = query.trim().toLowerCase();

    if (!q) return true;

    return (
      job.title.toLowerCase().includes(q) ||
      job.skills.some((skill) => skill.toLowerCase().includes(q)) ||
      job.location.toLowerCase().includes(q) ||
      job.companyName.toLowerCase().includes(q)
    );
  });

  /* =======================================================
     APPLY TO JOB
  ======================================================= */

  function applyToJob(job: OpenJob) {
    applyMutation.mutate({
      jobId: job.id,
    });
  }

  /* =======================================================
     SHELL
  ======================================================= */

  function Shell({ children }: { children: ReactNode }) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.paper,
        }}
        className="ts-app"
      >
        {FONTS}

        {/* HEADER */}

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <h1
              className="ts-display"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: T.ink,
                margin: 0,
              }}
            >
              TalentSync
            </h1>

            <nav
              style={{
                display: "flex",
                gap: 4,
              }}
            >
              {(
                [
                  ["applications", "My applications"],
                  ["browse", "Browse jobs"],
                  ["profile", "Profile"],
                ] as [Section, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  style={{
                    background: section === key ? T.tealSoft : "transparent",

                    color: section === key ? T.teal : T.sub,

                    border: "none",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                textAlign: "right",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: T.ink,
                  margin: 0,
                  fontSize: 14,
                }}
              >
                {loginUser?.name || user.name}
              </p>

              <p
                style={{
                  fontSize: 12,
                  color: T.sub,
                  margin: 0,
                }}
              >
                Candidate
              </p>
            </div>

            <div
              style={{
                position: "relative",
              }}
            >
              <button
                onClick={() => setShowProfile(!showProfile)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Avatar name={loginUser?.name || user.name} tone={T.coral} />
              </button>

              {showProfile && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 50,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 15,
                    width: 170,
                    boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
                    zIndex: 100,
                  }}
                >
                  <p
                    style={{
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    {loginUser?.name || user.name}
                  </p>

                  <button
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();

                      router.push("/auth/login");
                    }}
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "none",
                      background: T.coral,
                      color: "white",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

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

        <div
          style={{
            padding: 32,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (getUserMutation.isPending) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: T.sub,
            fontSize: 18,
          }}
        >
          Loading dashboard...
        </p>
      </div>
    );
  }

  /* =======================================================
     PROTECTED DASHBOARD
  ======================================================= */

  return (
    <ProtectedRoute>
      {/* =================================================
          APPLICATION DETAIL
      ================================================= */}

      {openApp ? (
        (() => {
          const app = applications.find((a) => a.id === openApp);

          if (!app) {
            return (
              <Shell>
                <p
                  style={{
                    color: T.sub,
                  }}
                >
                  Application not found.
                </p>
              </Shell>
            );
          }

          const stage = convertStatusToStage(app.status);

          return (
            <Shell>
              <button
                onClick={() => setOpenApp(null)}
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
                <ArrowLeft size={16} />
                Back to applications
              </button>

              <h2
                className="ts-display"
                style={{
                  fontSize: 30,
                  color: T.ink,
                  margin: "0 0 4px",
                }}
              >
                {app.job.title}
              </h2>

              <p
                style={{
                  color: T.sub,
                  marginBottom: 24,
                }}
              >
                {app.job.companyName}
                {" - "}
                {app.job.location}
              </p>

              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.line}`,
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: T.sub,
                      fontWeight: 600,
                    }}
                  >
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>

                  <StagePill stage={stage} />
                </div>

                <div
                  style={{
                    marginBottom: 8,
                  }}
                >
                  <StageTracker stage={stage} />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: T.sub,
                    marginTop: 8,
                  }}
                >
                  {STAGES.map((s) => (
                    <span
                      key={s}
                      style={{
                        width: 70,
                        textAlign: "center",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* JOB DETAILS */}

                <div
                  style={{
                    marginTop: 30,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: T.sub,
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      Job Type
                    </p>

                    <p
                      style={{
                        color: T.ink,
                        fontWeight: 600,
                      }}
                    >
                      {app.job.jobType}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color: T.sub,
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      Experience
                    </p>

                    <p
                      style={{
                        color: T.ink,
                        fontWeight: 600,
                      }}
                    >
                      {app.job.experience ?? 0} years
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color: T.sub,
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      Salary
                    </p>

                    <p
                      style={{
                        color: T.ink,
                        fontWeight: 600,
                      }}
                    >
                      {app.job.salary ? `₹${app.job.salary}` : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color: T.sub,
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      Location
                    </p>

                    <p
                      style={{
                        color: T.ink,
                        fontWeight: 600,
                      }}
                    >
                      {app.job.location}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div
                  style={{
                    marginTop: 24,
                  }}
                >
                  <p
                    style={{
                      color: T.sub,
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    Description
                  </p>

                  <p
                    style={{
                      color: T.sub,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {app.job.description}
                  </p>
                </div>

                {/* SKILLS */}

                {app.job.skills?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 16,
                    }}
                  >
                    {app.job.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: T.tealSoft,
                          color: T.teal,
                          padding: "5px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p
                  style={{
                    color: T.sub,
                    fontSize: 14,
                    marginTop: 24,
                    lineHeight: 1.6,
                  }}
                >
                  {stage === "Hired"
                    ? "Congratulations - the recruiter has marked you as hired for this role."
                    : "The recruiter is reviewing your application. You'll see the status update here as the application moves forward."}
                </p>
              </div>
            </Shell>
          );
        })()
      ) : section === "applications" ? (
        /* =================================================
           MY APPLICATIONS
        ================================================= */

        <Shell>
          <div
            style={{
              marginBottom: 28,
            }}
          >
            <h2
              className="ts-display"
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: T.ink,
                margin: 0,
              }}
            >
              My applications
            </h2>

            <p
              style={{
                color: T.sub,
                marginTop: 6,
              }}
            >
              Welcome back, {(loginUser?.name || user.name).split(" ")[0]}
            </p>
          </div>

          {/* STATS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <StatCard
              label="In progress"
              value={inProgress}
              icon={Clock}
              tone={T.amber}
            />

            <StatCard
              label="Interviewing"
              value={interviewing}
              icon={Send}
              tone={T.coral}
            />

            <StatCard
              label="Hired"
              value={hired}
              icon={CheckCircle2}
              tone={T.teal}
            />
          </div>

          {/* APPLICATION LIST */}

          <div
            style={{
              background: T.card,
              border: `1px solid ${T.line}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                className="ts-display"
                style={{
                  fontSize: 19,
                  margin: 0,
                  color: T.ink,
                }}
              >
                Your applications
              </h3>

              <button
                onClick={() => getApplicationsMutation.mutate()}
                disabled={getApplicationsMutation.isPending}
                style={{
                  border: `1px solid ${T.line}`,
                  background: "#fff",
                  borderRadius: 8,
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {getApplicationsMutation.isPending
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </div>

            {/* LOADING */}

            {getApplicationsMutation.isPending && applications.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                }}
              >
                <p
                  style={{
                    color: T.sub,
                  }}
                >
                  Loading your applications...
                </p>
              </div>
            )}

            {/* ERROR */}

            {getApplicationsMutation.isError && (
              <div
                style={{
                  background: T.coralSoft,
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    color: T.coral,
                    margin: 0,
                    fontSize: 14,
                  }}
                >
                  Failed to load applications.
                </p>

                <button
                  onClick={() => getApplicationsMutation.mutate()}
                  style={{
                    marginTop: 10,
                    border: "none",
                    background: T.coral,
                    color: "#fff",
                    padding: "7px 12px",
                    borderRadius: 7,
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!getApplicationsMutation.isPending &&
              applications.length === 0 &&
              !getApplicationsMutation.isError && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 40,
                  }}
                >
                  <p
                    style={{
                      color: T.sub,
                      margin: "0 0 16px",
                    }}
                  >
                    You haven't applied to anything yet.
                  </p>

                  <Button variant="accent" onClick={() => setSection("browse")}>
                    Browse open jobs
                  </Button>
                </div>
              )}

            {/* APPLICATIONS */}

            {applications.map((app, i) => {
              const stage = convertStatusToStage(app.status);

              return (
                <div
                  key={app.id}
                  onClick={() => setOpenApp(app.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 4px",
                    borderBottom:
                      i < applications.length - 1
                        ? `1px solid ${T.line}`
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Avatar name={app.job.companyName} />

                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          color: T.ink,
                          fontSize: 15,
                        }}
                      >
                        {app.job.title}
                      </h4>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: T.sub,
                          fontSize: 13,
                        }}
                      >
                        {app.job.companyName}
                        {" - "}
                        {app.job.location}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: T.sub,
                      }}
                    >
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>

                    <StagePill stage={stage} />

                    <ChevronRight size={16} color={T.sub} />
                  </div>
                </div>
              );
            })}
          </div>
        </Shell>
      ) : section === "browse" ? (
        /* =================================================
           BROWSE JOBS
        ================================================= */

        <Shell>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                className="ts-display"
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.ink,
                  margin: 0,
                }}
              >
                Browse jobs
              </h2>

              <p
                style={{
                  color: T.sub,
                  marginTop: 6,
                }}
              >
                {filteredJobs.length} open role
                {filteredJobs.length === 1 ? "" : "s"} right now
              </p>
            </div>

            <div
              style={{
                position: "relative",
              }}
            >
              <Search
                size={16}
                color={T.sub}
                style={{
                  position: "absolute",
                  left: 12,
                  top: 12,
                }}
              />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, skill, location"
                style={{
                  width: 260,
                  padding: "10px 14px 10px 36px",
                  borderRadius: 10,
                  border: `1px solid ${T.line}`,
                  fontSize: 14,
                  outline: "none",
                  background: T.card,
                }}
              />
            </div>
          </div>

          {getJobsMutation.isPending && (
            <p
              style={{
                color: T.sub,
                marginBottom: 20,
              }}
            >
              Loading jobs...
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: T.card,
                  border: `1px solid ${T.line}`,
                  borderRadius: 16,
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.teal,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {job.companyName}
                  </p>

                  <h4
                    className="ts-display"
                    style={{
                      margin: "4px 0 0",
                      fontSize: 18,
                      color: T.ink,
                    }}
                  >
                    {job.title}
                  </h4>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: T.sub,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {job.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: T.sub,
                    fontSize: 13,
                  }}
                >
                  <Briefcase size={14} />

                  {job.skills.join(" - ")}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: T.sub,
                    fontSize: 13,
                  }}
                >
                  <MapPin size={14} />

                  {job.location}
                </div>

                {job.salary && (
                  <div
                    style={{
                      fontSize: 13,
                      color: T.sub,
                    }}
                  >
                    Salary: ₹{job.salary}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: T.sub,
                    }}
                  >
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  {hasApplied(job.id) ? (
                    <Button
                      variant="ghost"
                      disabled
                      style={{
                        cursor: "not-allowed",
                        color: T.teal,
                        background: T.tealSoft,
                      }}
                    >
                      {applications.find((app) => app.jobId === job.id)
                        ?.status || "APPLIED"}
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      disabled={applyMutation.isPending}
                      onClick={() => setConfirmJob(job)}
                    >
                      {applyMutation.isPending ? "Applying..." : "Apply"}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: 48,
                  color: T.sub,
                  background: T.card,
                  border: `1px solid ${T.line}`,
                  borderRadius: 16,
                }}
              >
                No roles match your search right now.
              </div>
            )}
          </div>

          {/* =================================================
              CONFIRM APPLICATION MODAL
          ================================================= */}

          {confirmJob && (
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
                  width: 400,
                  maxWidth: "90vw",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3
                    className="ts-display"
                    style={{
                      margin: 0,
                      fontSize: 20,
                      color: T.ink,
                    }}
                  >
                    Apply to {confirmJob.title}
                  </h3>

                  <button
                    onClick={() => setConfirmJob(null)}
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

                <p
                  style={{
                    color: T.sub,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  You're applying to {confirmJob.title} at{" "}
                  {confirmJob.companyName}. The recruiter will review your
                  profile and update your status here as it moves forward.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  <Button
                    variant="ghost"
                    style={{
                      flex: 1,
                    }}
                    disabled={applyMutation.isPending}
                    onClick={() => setConfirmJob(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="accent"
                    style={{
                      flex: 1,
                    }}
                    disabled={applyMutation.isPending}
                    onClick={() => applyToJob(confirmJob)}
                  >
                    {applyMutation.isPending
                      ? "Applying..."
                      : "Confirm application"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Shell>
      ) : (
        /* =================================================
           PROFILE
        ================================================= */

        <Shell>
          <h2
            className="ts-display"
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: T.ink,
              margin: "0 0 24px",
            }}
          >
            Profile
          </h2>

          <div
            style={{
              background: T.card,
              border: `1px solid ${T.line}`,
              borderRadius: 16,
              padding: 28,
              display: "flex",
              alignItems: "center",
              gap: 18,
              maxWidth: 480,
            }}
          >
            <Avatar name={loginUser?.name || user.name} tone={T.coral} />

            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  color: T.ink,
                  fontSize: 16,
                }}
              >
                {loginUser?.name || user.name}
              </p>

              <p
                style={{
                  margin: "4px 0 0",
                  color: T.sub,
                  fontSize: 14,
                }}
              >
                {loginUser?.email || "No email on file"}
              </p>
            </div>
          </div>

          <p
            style={{
              color: T.sub,
              marginTop: 16,
              fontSize: 13,
            }}
          >
            Full profile editing (resume, skills, links) is coming soon.
          </p>
        </Shell>
      )}
    </ProtectedRoute>
  );
}
