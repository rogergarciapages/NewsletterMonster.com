// src/app/user/[userId]/edit/page.tsx
"use client";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { userProfileSchema, type UserProfileFormData } from "@/lib/schemas/user-profile";
import { uploadProfileImage } from "@/lib/utils/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loading from "./loading";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema)
  });

  // Fetch current user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/users/${session?.user?.user_id}`);
        if (response.ok) {
          const userData = await response.json();
          reset(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.user_id) {
      fetchUserData();
    }
  }, [session, reset]);

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setIsSubmitting(true);

      let profilePhotoUrl = undefined;
      const files = data.profile_photo as FileList | undefined;
      
      if (files && files.length > 0) {
        const file = files[0];
        if (file instanceof File) {
          profilePhotoUrl = await uploadProfileImage(file);
        }
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          profile_photo: profilePhotoUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
      router.push(`/user/${session?.user?.user_id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThreeColumnLayout>
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        <Card>
          <CardBody className="gap-4">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Name"
                    {...register("name")}
                    errorMessage={errors.name?.message}
                    isRequired
                  />
                </div>

                <div>
                  <Input
                    label="Surname"
                    {...register("surname")}
                    errorMessage={errors.surname?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Username"
                    {...register("username")}
                    errorMessage={errors.username?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Company Name"
                    {...register("company_name")}
                    errorMessage={errors.company_name?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Bio"
                    {...register("bio")}
                    errorMessage={errors.bio?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Website"
                    {...register("website")}
                    errorMessage={errors.website?.message}
                  />
                </div>

                <div>
                  <Input
                    type="file"
                    label="Profile Photo"
                    accept="image/*"
                    {...register("profile_photo")}
                    errorMessage={errors.profile_photo?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Twitter Username"
                    startContent="@"
                    {...register("twitter_username")}
                    errorMessage={errors.twitter_username?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Instagram Username"
                    startContent="@"
                    {...register("instagram_username")}
                    errorMessage={errors.instagram_username?.message}
                  />
                </div>

                <div>
                  <Input
                    label="LinkedIn Profile"
                    {...register("linkedin_profile")}
                    errorMessage={errors.linkedin_profile?.message}
                  />
                </div>

                <div>
                  <Input
                    label="YouTube Channel"
                    {...register("youtube_channel")}
                    errorMessage={errors.youtube_channel?.message}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}