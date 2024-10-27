import { Suspense } from "react";
import { ErrorBoundary } from "./error-boundary";
import BrandProfileHeader from "./index";
import Loading from "./loading";

export default function BrandProfilePage({ params }: { params: { brandId: string } }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <BrandProfileHeader
          brandName={params.brandId}
          user={null} // Fetch user data here
          newsletterCount={0} // Fetch newsletter count here
          followersCount={0} // Fetch followers count here
        />
      </Suspense>
    </ErrorBoundary>
  );
}