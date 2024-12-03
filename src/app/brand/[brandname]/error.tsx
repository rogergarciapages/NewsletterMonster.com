"use client";

import { useEffect } from "react";

// src/app/[brandname]/error.tsx

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <button
          onClick={reset}
          className="rounded-lg bg-yellow-500 px-6 py-2 text-white transition-colors hover:bg-yellow-700 dark:bg-yellow-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
