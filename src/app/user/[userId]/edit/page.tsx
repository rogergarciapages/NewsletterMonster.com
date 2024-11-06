"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import ImageUpload from "@/app/components/ui/image-upload";
import { type UserProfileFormData, userProfileSchema } from "@/lib/schemas/user-profile";
import { uploadProfileImage } from "@/lib/utils/upload";

import Loading from "./loading";

interface UserData {
  name: string;
  surname?: string;
  company_name?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  date_of_birth?: string;
  twitter_username?: string;
  instagram_username?: string;
  youtube_channel?: string;
  linkedin_profile?: string;
  profile_photo?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      surname: "",
      company_name: "",
      username: "",
      bio: "",
      website: "",
      location: "",
      twitter_username: "",
      instagram_username: "",
      youtube_channel: "",
      linkedin_profile: "",
    },
  });

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.user_id) return;

      try {
        const response = await fetch(`/api/users/${session.user.user_id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = (await response.json()) as UserData;

        setCurrentImage(userData.profile_photo);

        Object.entries(userData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && key in userProfileSchema.shape) {
            setValue(key as keyof UserProfileFormData, value);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [session, setValue]);

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setIsSubmitting(true);

      const formElement = document.querySelector("form") as HTMLFormElement;
      // eslint-disable-next-line quotes
      const fileInput = formElement?.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      console.log("File input:", {
        hasFile: !!file,
        fileDetails: file
          ? {
              name: file.name,
              type: file.type,
              size: file.size,
            }
          : null,
      });

      let profilePhotoUrl = undefined;
      if (file) {
        try {
          profilePhotoUrl = await uploadProfileImage(file);
          console.log("Upload successful, URL:", profilePhotoUrl);
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          toast.error("Failed to upload image");
          return;
        }
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          profile_photo: profilePhotoUrl || currentImage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      const result = await response.json();
      console.log("Profile update response:", result);

      toast.success("Profile updated successfully");
      await router.refresh();
      router.push(`/user/${session?.user?.user_id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;
  if (isLoading) return <Loading />;

  return (
    <ThreeColumnLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <Card>
          <CardBody className="gap-4">
            <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <ImageUpload
                    currentImage={currentImage}
                    register={register}
                    name="profile_photo"
                    errorMessage={errors.profile_photo?.message}
                    setError={setError}
                  />
                  <p className="px-2 py-4 text-xs text-zinc-800 dark:text-white/80">
                    The photo will be used for your profile, and will be visible to other users
                    across the platform.
                  </p>
                </div>
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
                  <Textarea label="Bio" {...register("bio")} errorMessage={errors.bio?.message} />
                </div>

                <div>
                  <Input
                    label="Website"
                    {...register("website")}
                    placeholder="https://your-website.com"
                    errorMessage={errors.website?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Website Domain"
                    {...register("website_domain")}
                    placeholder="your-website.com"
                    description="Domain for newsletter verification"
                    errorMessage={errors.website_domain?.message}
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
                    label="Twitter Username"
                    startContent="@"
                    {...register("twitter_username")}
                    errorMessage={errors.twitter_username?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Facebook Page/Group"
                    {...register("facebook_url")}
                    placeholder="https://facebook.com/your.page"
                    errorMessage={errors.facebook_url?.message}
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
                <Button color="danger" variant="light" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
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
