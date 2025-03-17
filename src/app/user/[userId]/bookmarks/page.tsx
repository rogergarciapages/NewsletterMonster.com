import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { authOptions } from "@/lib/auth";
import { getBookmarkedNewsletters } from "@/lib/services/bookmark";
import { getUserById } from "@/lib/services/user";

import { BookmarksClient } from "./bookmarks-client";

export const metadata = {
  title: "Your Bookmarks | Newsletter Monster",
  description: "View and manage your bookmarked newsletters",
};

export default async function BookmarksPage({ params }: { params: { userId: string } }) {
  // Get current user session
  const session = await getServerSession(authOptions);

  // If no session or user IDs don't match, redirect to home
  if (!session?.user || session.user.user_id !== params.userId) {
    redirect("/");
  }

  // Verify user exists
  const user = await getUserById(params.userId);
  if (!user) {
    redirect("/");
  }

  // Get initial bookmarks
  const initialBookmarks = await getBookmarkedNewsletters(params.userId, 0, 20);

  return (
    <ThreeColumnLayout>
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your Bookmarks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Newsletters you've saved for later
          </p>
        </header>

        <BookmarksClient initialBookmarks={initialBookmarks} userId={params.userId} />
      </div>
    </ThreeColumnLayout>
  );
}
