"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

export default function ManageBrandPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    domain: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    youtube: "",
    github: "",
  });

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`/api/brands?brandname=${params.brandname}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch brand");
        }

        if (data.length === 0) {
          notFound();
        }

        const brandData = data[0];
        setFormData({
          name: brandData.name,
          description: brandData.description || "",
          website: brandData.website || "",
          domain: brandData.domain || "",
          instagram: brandData.social_links?.instagram || "",
          twitter: brandData.social_links?.twitter || "",
          linkedin: brandData.social_links?.linkedin || "",
          facebook: brandData.social_links?.facebook || "",
          youtube: brandData.social_links?.youtube || "",
          github: brandData.social_links?.github || "",
        });
      } catch (error) {
        console.error("Error fetching brand:", error);
        toast.error("Failed to load brand data");
      }
    };

    if (params.brandname) {
      fetchBrand();
    }
  }, [params.brandname, router]);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Brand: {formData.name}</h1>
    </div>
  );
}
