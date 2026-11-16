"use client";
import { ErrorState } from "./components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      error={new Error("We could not load this page. Please try again.")}
      retry={reset}
    />
  );
}
