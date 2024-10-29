// src/app/user/[userId]/edit/page.tsx
"use client";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { userProfileSchema, type UserProfileFormData } from "@/lib/schemas/user-profile";
import { uploadProfileImage } from "@/lib/utils/minio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
  });

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setIsSubmitting(true);

      // Handle image upload if there's a new image
      let profilePhotoUrl = undefined;
      if (data.profile_photo && data.profile_photo.length > 0) {
        profilePhotoUrl = await uploadProfileImage(data.profile_photo[0]);
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          profile_photo_url: profilePhotoUrl, // Send as separate field
          profile_photo: undefined, // Don't send the FileList
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
                    label="Location"
                    {...register("location")}
                    errorMessage={errors.location?.message}
                  />
                </div>

                <div>
                  <Input
                    type="date"
                    label="Date of Birth"
                    {...register("date_of_birth")}
                    errorMessage={errors.date_of_birth?.message}
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
                    label="YouTube Channel"
                    {...register("youtube_channel")}
                    errorMessage={errors.youtube_channel?.message}
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
                    type="file"
                    label="Profile Photo"
                    accept="image/*"
                    {...register("profile_photo")}
                    errorMessage={errors.profile_photo?.message}
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