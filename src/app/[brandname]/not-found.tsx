// src/app/[brandname]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Brand Not Found</h2>
        <p className="mb-6 text-gray-600">
          The brand you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
