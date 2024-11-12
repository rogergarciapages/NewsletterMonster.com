// src/app/components/layouts/three-column-layout.tsx
import dynamic from "next/dynamic";
import React, { ReactNode } from "react";

interface ThreeColumnLayoutProps {
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

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] flex-col">
      <div className="flex flex-grow flex-col lg:flex-row">
        <aside className="lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:w-1/5">
          <div className="max-h-screen overflow-y-auto p-4">
            <LeftSidebar />
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-64px)] flex-1 flex-col p-4">
          <div className="flex-grow">{children}</div>
        </div>

        <aside className="lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:w-1/5">
          <div className="max-h-screen overflow-y-auto p-4">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ThreeColumnLayout;
