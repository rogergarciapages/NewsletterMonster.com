import React from "react";

import Footer from "../components/footer";

export const metadata = {
  title: "About Us | Newsletter Monster",
  description:
    "Learn about Newsletter Monster's mission to preserve, showcase, and celebrate the art of newsletters.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
