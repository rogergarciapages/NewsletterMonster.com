// src/app/components/layouts/three-column-layout.tsx
import React, { ReactNode } from "react";
import LeftSidebar from "../left-sidebar";
import RightSidebar from "../right-sidebar";

interface ThreeColumnLayoutProps {
  children: ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
  return (
    <main className="max-w-[1400px] mx-auto min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="lg:w-1/5 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]">
          <div className="p-4 max-h-screen overflow-y-auto">
            <LeftSidebar />
          </div>
        </div>
        <div className="flex-1 p-4 min-h-[calc(100vh-64px)] flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
        </div>
        <div className="lg:w-1/5 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]">
          <div className="p-4 max-h-screen overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThreeColumnLayout;