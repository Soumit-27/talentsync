// Resume requests use the same-origin API proxy and session cookie.
export function resumeViewUrl(applicationId?: string) {
  return applicationId
    ? "/api/applications/" + encodeURIComponent(applicationId) + "/resume"
    : "/api/profile/resume";
}
