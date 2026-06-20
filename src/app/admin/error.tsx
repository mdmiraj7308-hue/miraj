"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isUploadTooLarge = error.message.includes("Body exceeded");

  return (
    <div className="rounded-lg border border-red-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Admin panel error</h2>
      <p className="mt-2 text-sm text-gray-600">
        {isUploadTooLarge
          ? "The upload was too large for the server. Use an image under 5 MB, then click Retry and save again."
          : "Something failed while loading this admin page. Verify your Supabase session and environment variables."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-md bg-theme px-4 py-2 text-sm font-medium text-white hover:bg-theme-light"
      >
        Retry
      </button>
    </div>
  );
}
