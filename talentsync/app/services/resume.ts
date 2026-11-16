// Use the configured API origin for direct API deployments, or the same-origin proxy.
export function resumeViewUrl(applicationId?: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  return (
    base +
    (applicationId
      ? "/api/applications/" + encodeURIComponent(applicationId) + "/resume"
      : "/api/profile/resume")
  );
}
