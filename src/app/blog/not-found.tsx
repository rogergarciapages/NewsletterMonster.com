import Link from "next/link";

import Footer from "@/app/components/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-grow px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-red-50 p-6 text-center dark:bg-red-950/40">
          <h1 className="mb-4 text-2xl font-bold text-red-800 dark:text-red-300">
            Blog Content Not Found
          </h1>
          <p className="mb-4 text-red-700 dark:text-red-400">
            We couldn't find the blog content you're looking for. It might have been moved or
            deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/blog"
              className="rounded-md bg-torch-800 px-4 py-2 text-white hover:bg-torch-700 dark:bg-torch-900 dark:hover:bg-torch-800"
            >
              Return to Blog Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
