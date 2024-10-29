// src/app/user/[userId]/page.tsx
import NewsletterCard from "@/app/components/brand/newsletter/card";
import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import { ErrorBoundary } from "@/app/components/brand/profile/header/error-boundary";
import Loading from "@/app/components/brand/profile/header/loading";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { getUserProfile } from "@/lib/services/user";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({ 
  params 
}: { 
  params: { userId: string } 
}): Promise<Metadata> {
  const data = await getUserProfile(params.userId);
  if (!data) return notFound();

  const { user } = data;
  const displayName = user.name; // Already just the first name

  return {
    title: `${displayName} - Profile | NewsletterMonster`,
    description: user.bio || `View ${displayName}'s profile and newsletters on NewsletterMonster`,
    openGraph: {
      title: `${displayName} on NewsletterMonster`,
      description: user.bio || `Check out ${displayName}'s profile and newsletters`,
      images: user.profile_photo ? [{ url: user.profile_photo }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} on NewsletterMonster`,
      description: user.bio || `Check out ${displayName}'s profile and newsletters`,
      images: user.profile_photo ? [user.profile_photo] : [],
    }
  };
}

export default async function UserProfilePage({ 
  params 
}: { 
  params: { userId: string } 
}) {
  const session = await getServerSession();
  const data = await getUserProfile(params.userId);
  
  if (!data) {
    notFound();
  }

  const { user, newsletters, followersCount } = data;
  const isOwnProfile = session?.user?.email === user.email;

  return (
    <ThreeColumnLayout>
      <div className="w-full">
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <BrandProfileHeaderWrapper 
              brandName={user.name} // Already just the first name
              user={user}
              newsletterCount={newsletters.length}
              followersCount={followersCount}
              isFollowing={false}
              hideFollowButton={isOwnProfile} // Add this prop to the interface
              isOwnProfile={isOwnProfile} // Add this prop to the interface
            />
          </Suspense>
        </ErrorBoundary>
        
        <main className="max-w-6xl mx-auto px-1 py-8">
          <h1 className="sr-only">{user.name}&apos;s Newsletters</h1>
          
          {isOwnProfile && newsletters.length === 0 && (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Welcome to your profile!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                You haven&apos;t published any newsletters yet.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {newsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.newsletter_id}
                newsletter={newsletter}
                brandname={user.username || user.name}
              />
            ))}
          </div>
        </main>
      </div>
    </ThreeColumnLayout>
  );
}