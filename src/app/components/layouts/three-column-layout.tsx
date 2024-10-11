import React, { ReactNode } from "react";
import AppNavbar from "../app-navbar";
import LeftSidebar from "../left-sidebar";
import Providers from "../providers";
import RightSidebar from "../right-sidebar";

interface ThreeColumnLayoutProps {
  children: ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
  return (
    <Providers>
      <main className="max-w-[1400px] mx-auto space-y-5 min-h-screen">
        <AppNavbar />
        <div className="flex flex-col lg:flex-row min-h-screen w-full dark:bg-[#222]">
          <div className="lg:w-1/5 p-4">
            <LeftSidebar />
          </div>
          <div className="flex-1 p-4">
            {children}
          </div>
          <div className="lg:w-1/5 p-4">
            <RightSidebar />
          </div>
        </div>
      </main>
    </Providers>
  );
};

export default ThreeColumnLayout;
