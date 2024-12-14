"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import slugify from "slugify";
import { toast } from "sonner";

import LoginModal from "@/app/components/login-modal";

export default function CreateBrandPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    domain: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "website" && !formData.domain ? { domain: extractDomain(value) } : {}),
    }));
  };

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
      return domain.replace(/^www\./, "");
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!formData.name) {
      toast.error("Brand name is required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug: slugify(formData.name, { lower: true, strict: true }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create brand");
      }

      toast.success("Brand created successfully!");
      router.push(`/brand/${data.slug}`);
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Create Your Brand</h1>
        <p className="text-default-500">
          Set up your brand page to showcase your newsletters and connect with your audience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Brand Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your brand name"
          isRequired
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Tell us about your brand"
          minRows={3}
        />

        <Input
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://example.com"
          type="url"
        />

        <Input
          label="Domain"
          name="domain"
          value={formData.domain}
          onChange={handleInputChange}
          placeholder="example.com"
          description="This will be used to verify your brand ownership"
        />

        <Button type="submit" color="primary" className="w-full" size="lg" isLoading={isLoading}>
          Create Brand
        </Button>
      </form>

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
