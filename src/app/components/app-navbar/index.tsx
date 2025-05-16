import { headers } from "next/headers";
import { Suspense } from "react";

import NavbarSkeleton from "./components/navbar-skeleton";
import NavbarClient from "./navbar-client";

export default async function NavbarServer() {
  // Force dynamic rendering for auth state
  headers();

  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarClient />
    </Suspense>
  );
}
