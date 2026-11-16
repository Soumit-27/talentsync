"use client";
import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getLoginUser, userHome, type SessionUser } from "../services/auth";
import { ErrorState, Loading } from "./ui";
const SessionContext = createContext<SessionUser | null>(null);
export const useSession = () => {
  const user = useContext(SessionContext);
  if (!user) throw new Error("Session is required.");
  return user;
};
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const client = useQueryClient();
  const session = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        return (await getLoginUser()).user;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401)
          return null;
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const user = session.data;
  const candidateRoute =
    pathname === "/candidateDashboard" || pathname.startsWith("/candidate/");
  let redirect: string | null = null;
  if (user === null) redirect = "/auth/login";
  if (user) {
    if (user.role === "ADMIN") redirect = "/auth/login";
    else if (candidateRoute !== (user.role === "CANDIDATE"))
      redirect = userHome(user);
    else if (
      user.role === "CANDIDATE" &&
      !user.profileCompleted &&
      pathname !== "/candidate/profile"
    )
      redirect = "/candidate/profile";
    else if (
      user.role === "RECRUITER" &&
      !user.company &&
      pathname !== "/recruiter/company"
    )
      redirect = "/recruiter/company";
  }
  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);
  useEffect(() => {
    const expired = () => {
      client.clear();
      router.replace("/auth/login");
    };
    window.addEventListener("talentsync:session-expired", expired);
    return () =>
      window.removeEventListener("talentsync:session-expired", expired);
  }, [client, router]);
  if (session.isError)
    return (
      <ErrorState error={session.error} retry={() => void session.refetch()} />
    );
  if (session.isPending || !user || redirect)
    return <Loading text="Checking your session..." />;
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}
