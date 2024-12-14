"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Input, Tab, Tabs, Textarea, useDisclosure } from "@nextui-org/react";
import { Brand } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import LoginModal from "@/app/components/login-modal";

interface BrandWithCounts extends Brand {
  _count: {
    followers: number;
    newsletters: number;
  };
  social_links: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    github?: string;
  } | null;
}

export default function ManageBrandPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState<BrandWithCounts | null>(null);
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
        const response = await fetch(`/api/brands?slug=${params.slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch brand");
        }

        if (data.length === 0) {
          notFound();
        }

        const brandData = data[0];
        setBrand(brandData);
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

    if (params.slug) {
      fetchBrand();
    }
  }, [params.slug, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      onOpen();
      return;
    }

    if (!brand) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/brands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId: brand.brand_id,
          name: formData.name,
          description: formData.description,
          website: formData.website,
          domain: formData.domain,
          social_links: {
            update: {
              instagram: formData.instagram,
              twitter: formData.twitter,
              linkedin: formData.linkedin,
              facebook: formData.facebook,
              youtube: formData.youtube,
              github: formData.github,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update brand");
      }

      toast.success("Brand updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update brand");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !brand ||
      !confirm("Are you sure you want to delete this brand? This action cannot be undone.")
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/brands?brandId=${brand.brand_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete brand");
      }

      toast.success("Brand deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete brand");
    } finally {
      setIsLoading(false);
    }
  };

  if (!brand) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Manage Brand</h1>
        <p className="text-default-500">Update your brand information and settings.</p>
      </div>

      <Tabs aria-label="Brand management options">
        <Tab key="general" title="General">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Brand Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isRequired
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              minRows={3}
            />

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              type="url"
            />

            <Input
              label="Domain"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              description="This will be used to verify your brand ownership"
            />

            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </form>
        </Tab>

        <Tab key="social" title="Social Links">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="@username"
              startContent="instagram.com/"
            />

            <Input
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="@username"
              startContent="twitter.com/"
            />

            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="company/username"
              startContent="linkedin.com/"
            />

            <Input
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              placeholder="username"
              startContent="facebook.com/"
            />

            <Input
              label="YouTube"
              name="youtube"
              value={formData.youtube}
              onChange={handleInputChange}
              placeholder="channel"
              startContent="youtube.com/"
            />

            <Input
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="username"
              startContent="github.com/"
            />

            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Save Social Links
            </Button>
          </form>
        </Tab>

        <Tab key="danger" title="Danger Zone">
          <div className="border-danger rounded-lg border p-4">
            <h3 className="text-danger mb-2 text-xl font-semibold">Delete Brand</h3>
            <p className="mb-4 text-default-500">
              Once you delete a brand, there is no going back. Please be certain.
            </p>
            <Button color="danger" variant="flat" onPress={handleDelete} isLoading={isLoading}>
              Delete Brand
            </Button>
          </div>
        </Tab>
      </Tabs>

      <LoginModal isOpen={isOpen} onOpenChange={onClose} />
    </div>
  );
}
