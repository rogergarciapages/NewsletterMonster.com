// src/app/components/layouts/three-column-layout.tsx
import dynamic from "next/dynamic";
import React, { ReactNode } from "react";

import Footer from "../footer";

interface _ThreeColumnLayoutProps {
  children: ReactNode;
}

const LeftSidebar = dynamic(() => import("../left-sidebar"), {
  ssr: false,
  loading: () => (
    <div className="h-full animate-pulse">
      <div className="h-full rounded-lg bg-gray-200" />
    </div>
  ),
});

const RightSidebar = dynamic(() => import("../right-sidebar"), {
  ssr: false,
  loading: () => (
    <div className="h-full animate-pulse">
      <div className="h-full rounded-lg bg-gray-200" />
    </div>
  ),
});

export default function ThreeColumnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-grow px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-2">
            <div className="max-h-screen overflow-y-auto p-4">
              <LeftSidebar />
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="flex-grow">{children}</div>
          </div>

          <aside className="lg:col-span-2">
            <div className="max-h-screen overflow-y-auto p-4">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
