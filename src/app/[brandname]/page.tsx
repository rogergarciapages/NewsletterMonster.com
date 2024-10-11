"use client";

import { usePathname } from "next/navigation";
import ThreeColumnLayout from "../components/layouts/three-column-layout"; // Adjust path as needed

const BrandPage = () => {
  const pathname = usePathname();
  const brandname = pathname.split("/")[1]; // Extract the brandname from the URL

  return (
    <ThreeColumnLayout>
      <p>{brandname} Newsletters</p>
      {/* Fetch and list newsletters from this brand */}
      {/* Implement data fetching logic here */}
    </ThreeColumnLayout>
  );
};

export default BrandPage;
