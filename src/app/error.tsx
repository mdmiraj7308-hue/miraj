"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="glassmorphism max-w-lg p-8 text-center">
        <h1 className="gradient-text mb-3 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-6 text-sm text-gray-400">
          We couldn&apos;t load the portfolio page. Check your Supabase connection and try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-theme px-5 py-2.5 text-sm font-medium text-white transition hover:bg-theme-light"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
