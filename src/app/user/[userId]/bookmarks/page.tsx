import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBookmarkedNewsletters } from "@/lib/services/bookmark";

import { BookmarksClient } from "./bookmarks-client";

export const metadata = {
  title: "Your Bookmarks | Newsletter Monster",
  description: "View and manage your bookmarked newsletters",
};

// Function to get user by username or id
async function getUserByIdentifier(identifier: string) {
  try {
    // First try to find by username
    let user = await prisma.user.findUnique({
      where: { username: identifier },
    });

    // If not found by username, try by user_id (UUID)
    if (!user) {
      user = await prisma.user.findUnique({
        where: { user_id: identifier },
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getUserByIdentifier:", error);
    return null;
  }
}

export default async function BookmarksPage({ params }: { params: { userId: string } }) {
  // Get current user session
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    // Redirect to login page if not logged in
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(`/user/${params.userId}/bookmarks`)}`
    );
  }

  // Get user from database
  const user = await getUserByIdentifier(params.userId);

  // If user doesn't exist, redirect to 404
  if (!user) {
    redirect("/404");
  }

  // Check if the logged-in user is trying to access their own bookmarks
  if (session.user.user_id !== user.user_id) {
    // If trying to access someone else's bookmarks, redirect to unauthorized page or their own bookmarks
    const redirectUrl = session.user.username
      ? `/user/${session.user.username}/bookmarks`
      : `/user/${session.user.user_id}/bookmarks`;

    // Add a query param to indicate they tried to access someone else's bookmarks
    redirect(`${redirectUrl}?unauthorized=true`);
  }

  // Get initial bookmarks using the actual user_id (not the identifier from URL)
  const initialBookmarks = await getBookmarkedNewsletters(user.user_id, 0, 20);

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

        <BookmarksClient initialBookmarks={initialBookmarks} userId={user.user_id} />
      </div>
    </ThreeColumnLayout>
  );
}
