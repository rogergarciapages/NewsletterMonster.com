"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Spinner, Textarea, Tooltip } from "@nextui-org/react";
import { IconRefresh } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import ImageUpload from "@/app/components/ui/image-upload";
import SocialLinksForm from "@/app/components/ui/social-links-form";
import {
  type SocialLinksFormData,
  type UserProfileFormData,
  socialLinksSchema,
  userProfileSchema,
} from "@/lib/schemas/user-profile";
import { uploadProfileImage } from "@/lib/utils/upload";

import Loading from "./loading";

// Utility function to ensure profile image URL has the correct structure
const ensureCorrectImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (url.includes("/userpics/public/")) return url;

  const match = url.match(/\/([a-f0-9-]+)\/([a-f0-9-]+)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
  if (match) {
    const userId = match[1];
    const extension = match[4].toLowerCase();
    const minioEndpoint = url.split("/userpics")[0];
    return `${minioEndpoint}/userpics/public/${userId}/${userId}.${extension}`;
  }
  return url;
};

interface UserData {
  name: string;
  surname?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  profile_photo?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
}

export default function EditProfilePage() {
  const router = useRouter();
  const {
    data: session,
    status,
    update: updateSession,
  } = useSession({
    required: true,
  });
  const { userId } = useParams() as { userId: string };

  // Debug user ID information
  useEffect(() => {
    console.log("Session in edit profile page:", {
      status,
      user_id: session?.user?.user_id,
      params_userId: userId,
      isAuthenticated: !!session,
    });

    // Check if we have a session but userId is undefined in the URL
    if (userId === "undefined") {
      if (session?.user?.user_id) {
        console.log("Redirecting from undefined userId to actual user ID:", session.user.user_id);
        router.replace(`/user/${session.user.user_id}/edit`);
      } else {
        console.warn("Both URL userId and session user_id are undefined!");
        // If both are undefined, redirect to homepage
        if (status === "authenticated") {
          console.log("User is authenticated but has no ID - redirecting to homepage");
          router.replace("/");
        }
      }
    }
  }, [session, userId, router, status]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);
  const [originalData, setOriginalData] = useState<UserData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [fieldValidating, setFieldValidating] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successToastRef = useRef<string | null>(null);

  // Setup form with userProfileSchema for User data
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    watch,
    reset,
    formState: { errors, isDirty, dirtyFields, isValidating },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      bio: "",
      website: "",
      location: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Setup form for social links
  const {
    register: registerSocial,
    handleSubmit: handleSubmitSocial,
    setValue: setValueSocial,
    control: socialFormControl,
    formState: { errors: errorsSocial, isDirty: isDirtySocial, dirtyFields: dirtyFieldsSocial },
    reset: resetSocial,
  } = useForm<SocialLinksFormData>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      facebook: "",
      github: "",
    },
    mode: "onChange",
  });

  // Watch form values for changes
  const watchedValues = watch();
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, watchedValues]);

  // Define the beforeunload handler
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // This message isn't displayed in modern browsers but the prompt still appears
      }
    },
    [hasUnsavedChanges]
  );

  // Track field validations
  useEffect(() => {
    const validationFields: Record<string, boolean> = {};

    // Set all fields that are currently being validated
    Object.keys(dirtyFields).forEach(field => {
      if (isValidating) {
        validationFields[field as keyof UserProfileFormData] = true;
      } else {
        validationFields[field as keyof UserProfileFormData] = false;
      }
    });

    setFieldValidating(validationFields);
  }, [isValidating, dirtyFields]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, handleBeforeUnload]);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.user_id) return;

      try {
        const response = await fetch(`/api/users/${session.user.user_id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();

        // Fix profile photo URL if present and set it
        if (userData.profile_photo) {
          const correctedUrl = ensureCorrectImageUrl(userData.profile_photo);
          userData.profile_photo = correctedUrl;
          setCurrentImage(correctedUrl || undefined);
        } else if (session.user.profile_photo) {
          // Fallback to session profile photo if available
          const correctedUrl = ensureCorrectImageUrl(session.user.profile_photo);
          userData.profile_photo = correctedUrl;
          setCurrentImage(correctedUrl || undefined);
        } else {
          setCurrentImage(undefined);
        }

        console.log("Setting user data with profile photo:", userData.profile_photo);

        setOriginalData(userData);
        reset(userData);
        setIsLoading(false);

        // Fetch social links separately
        try {
          const socialResponse = await fetch("/api/users/social-links");
          if (socialResponse.ok) {
            const { socialLinks } = await socialResponse.json();

            if (socialLinks) {
              // Set the socialLinks in the original data
              userData.socialLinks = socialLinks;
              setOriginalData(userData);

              // Set values in the social links form
              Object.entries(socialLinks).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  setValueSocial(key as keyof SocialLinksFormData, value as string);
                }
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch social links", error);
          // Continue without social links if they fail to load
        }
      } catch (error) {
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [session, setValue, setValueSocial, reset]);

  // Reset entire form
  const resetForm = () => {
    if (!originalData) return;

    // Reset form back to original values
    Object.entries(originalData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key in userProfileSchema.shape) {
        setValue(key as keyof UserProfileFormData, value, { shouldDirty: false });
      }
    });

    // Reset social links if available
    if (originalData.socialLinks) {
      Object.entries(originalData.socialLinks).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          setValueSocial(key as keyof SocialLinksFormData, value as string, { shouldDirty: false });
        }
      });
    }

    // Reset image preview
    setCurrentImage(originalData.profile_photo);

    toast.info("Form has been reset to original values");
    setHasUnsavedChanges(false);
  };

  // Reset individual field to original value
  const resetField = (field: keyof UserProfileFormData) => {
    if (!originalData) return;

    // Use type assertion to ensure TypeScript understands this is a valid key
    const originalValue = originalData[field as keyof UserData];

    // Use type assertion to satisfy TypeScript - we know these fields are compatible
    setValue(field, (originalValue as string | FileList | undefined) || "", { shouldDirty: false });

    toast.info(`Reset ${field.replace("_", " ")} to original value`);
  };

  // Reset individual social media field to original value
  const resetSocialField = (field: keyof SocialLinksFormData) => {
    if (!originalData?.socialLinks) return;

    const originalValue = originalData.socialLinks[field as keyof typeof originalData.socialLinks];
    setValueSocial(field, (originalValue as string) || "", { shouldDirty: false });
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setIsSubmitting(true);

      // Show optimistic UI update with explicit string typing
      successToastRef.current = toast.loading("Updating your profile...") as string;

      const formElement = document.querySelector("form") as HTMLFormElement;
      const fileInput = formElement?.querySelector("input[type='file']") as HTMLInputElement;
      const file = fileInput?.files?.[0];

      let profilePhotoUrl = undefined;
      if (file) {
        try {
          // First phase of two-phase process: upload the image but don't update DB yet
          profilePhotoUrl = await uploadProfileImage(file);

          // If upload fails, throw error and don't proceed to DB update
          if (!profilePhotoUrl) {
            throw new Error("Image upload failed");
          }
        } catch (uploadError) {
          if (successToastRef.current) {
            toast.error("Failed to upload image", { id: successToastRef.current });
            successToastRef.current = null;
          } else {
            toast.error("Failed to upload image");
          }
          setIsSubmitting(false);
          return;
        }
      }

      // Second phase: Update the user profile with new data including image URL if available
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

      // Also update social links separately
      const socialData = handleSubmitSocial(async socialData => {
        try {
          const socialResponse = await fetch("/api/users/social-links", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(socialData),
          });

          if (!socialResponse.ok) {
            const errorText = await socialResponse.text();
            console.error(`Failed to update social links: ${errorText}`);
            // We don't throw here as we still want to complete the overall update
          }
        } catch (error) {
          console.error("Error updating social links:", error);
        }
      })();

      // Wait for both updates to complete
      await socialData;

      const updatedUserData = await response.json();
      setOriginalData(updatedUserData.user);

      // Update the session with the new username if it was changed
      if (updatedUserData?.user?.username) {
        try {
          // Update session with new username
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              username: updatedUserData.user.username,
            },
          });

          // Clear unsaved changes flag to prevent browser warning
          setHasUnsavedChanges(false);

          // Remove beforeunload event listener
          window.removeEventListener("beforeunload", handleBeforeUnload);

          // Force a session refresh to ensure the UI updates
          window.location.href = `/user/${updatedUserData.user.username}`;
          return; // Exit early as we're redirecting
        } catch (sessionError) {
          console.error("Failed to update session:", sessionError);
          // Continue with normal flow if session update fails
        }
      }

      if (successToastRef.current) {
        toast.success("Profile updated successfully!", { id: successToastRef.current });
        successToastRef.current = null;
      } else {
        toast.success("Profile updated successfully!");
      }

      setHasUnsavedChanges(false);
      await router.refresh();

      // Only redirect if we haven't already redirected with window.location
      if (!updatedUserData?.user?.username) {
        // Redirect to user ID URL if no username
        if (session?.user?.user_id) {
          router.push(`/user/${session.user.user_id}`);
        } else {
          // Fallback to homepage if something went wrong
          router.push("/");
        }
      }
    } catch (error) {
      if (successToastRef.current) {
        toast.error(error instanceof Error ? error.message : "Failed to update profile", {
          id: successToastRef.current,
        });
        successToastRef.current = null;
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to update profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (!session?.user || userId === "undefined") {
    return <Loading />;
  }

  return (
    <ThreeColumnLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <Card>
          <CardBody className="gap-4">
            <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>

            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              aria-label="Edit profile form"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <ImageUpload
                    currentImage={currentImage}
                    register={register}
                    name="profile_photo"
                    errorMessage={errors.profile_photo?.message}
                    setError={setError}
                  />
                  <p className="px-2 py-2 text-xs text-zinc-800 dark:text-white/80">
                    The photo will be used for your profile, and will be visible to other users
                    across the platform. (Max 2MB, JPG/PNG/WebP)
                  </p>
                </div>

                {/* Name field with reset button */}
                <div className="relative">
                  <Input
                    label="Name"
                    {...register("name")}
                    id="name"
                    errorMessage={errors.name?.message}
                    isRequired
                    description="Your display name (min. 2 characters)"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    isInvalid={!!errors.name}
                    endContent={
                      dirtyFields.name && (
                        <Tooltip content="Reset to original value">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => resetField("name")}
                            aria-label="Reset name field"
                          >
                            <IconRefresh size={18} />
                          </Button>
                        </Tooltip>
                      )
                    }
                    startContent={fieldValidating.name && <Spinner size="sm" />}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Surname"
                    {...register("surname")}
                    id="surname"
                    errorMessage={errors.surname?.message}
                    aria-invalid={!!errors.surname}
                    isInvalid={!!errors.surname}
                    endContent={
                      dirtyFields.surname && (
                        <Tooltip content="Reset to original value">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => resetField("surname")}
                            aria-label="Reset surname field"
                          >
                            <IconRefresh size={18} />
                          </Button>
                        </Tooltip>
                      )
                    }
                    startContent={fieldValidating.surname && <Spinner size="sm" />}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Username"
                    {...register("username")}
                    id="username"
                    errorMessage={errors.username?.message}
                    description="3-30 characters, letters, numbers, underscores, hyphens only"
                    placeholder="john_doe"
                    aria-invalid={!!errors.username}
                    isInvalid={!!errors.username}
                    endContent={
                      dirtyFields.username && (
                        <Tooltip content="Reset to original value">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => resetField("username")}
                            aria-label="Reset username field"
                          >
                            <IconRefresh size={18} />
                          </Button>
                        </Tooltip>
                      )
                    }
                    startContent={fieldValidating.username && <Spinner size="sm" />}
                  />
                </div>

                <div className="relative md:col-span-2">
                  <Textarea
                    label="Bio"
                    {...register("bio")}
                    id="bio"
                    errorMessage={errors.bio?.message}
                    description="Tell others about yourself (max 500 characters)"
                    placeholder="Share a little about yourself, your interests, or your work"
                    aria-invalid={!!errors.bio}
                    isInvalid={!!errors.bio}
                    endContent={
                      dirtyFields.bio && (
                        <Tooltip content="Reset to original value">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => resetField("bio")}
                            aria-label="Reset bio field"
                            className="absolute right-2 top-2 z-10"
                          >
                            <IconRefresh size={18} />
                          </Button>
                        </Tooltip>
                      )
                    }
                  />
                  {fieldValidating.bio && <Spinner size="sm" className="absolute left-2 top-2" />}
                </div>

                <div className="relative">
                  <Input
                    label="Website"
                    {...register("website")}
                    id="website"
                    placeholder="https://your-website.com"
                    errorMessage={errors.website?.message}
                    description="Your personal or business website"
                    aria-invalid={!!errors.website}
                    isInvalid={!!errors.website}
                    endContent={
                      dirtyFields.website && (
                        <Tooltip content="Reset to original value">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => resetField("website")}
                            aria-label="Reset website field"
                          >
                            <IconRefresh size={18} />
                          </Button>
                        </Tooltip>
                      )
                    }
                    startContent={fieldValidating.website && <Spinner size="sm" />}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Location"
                    {...register("location")}
                    id="location"
                    errorMessage={errors.location?.message}
                    placeholder="City, Country"
                    aria-invalid={!!errors.location}
                    isInvalid={!!errors.location}
                    endContent={
                      dirtyFields.location && (
                        <Tooltip content="Reset to original value">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => resetField("location")}
                            aria-label="Reset location field"
                          >
                            <IconRefresh size={18} />
                          </Button>
                        </Tooltip>
                      )
                    }
                    startContent={fieldValidating.location && <Spinner size="sm" />}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <SocialLinksForm
                  formMethods={{
                    register: registerSocial,
                    control: socialFormControl,
                    formState: {
                      errors: errorsSocial,
                      dirtyFields: dirtyFieldsSocial,
                    },
                  }}
                  onReset={resetSocialField}
                />
              </div>

              <div className="flex justify-end gap-2" role="group" aria-label="Form actions">
                <Button
                  color="default"
                  variant="light"
                  onClick={() => {
                    // Clear unsaved changes flag to prevent browser warning
                    setHasUnsavedChanges(false);
                    router.push(`/user/${session?.user?.user_id}`);
                  }}
                  aria-label="Cancel and return to profile"
                >
                  Cancel
                </Button>
                <Button
                  color="warning"
                  variant="flat"
                  onClick={resetForm}
                  isDisabled={!hasUnsavedChanges || isSubmitting}
                  aria-label="Reset all form fields to original values"
                >
                  Reset All Fields
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!hasUnsavedChanges && !dirtyFields.profile_photo}
                  aria-label="Save profile changes"
                >
                  Save Changes
                </Button>
              </div>

              {hasUnsavedChanges && (
                <div
                  className="rounded-lg bg-warning-50 p-3 text-center text-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm font-medium">
                    You have unsaved changes. Click Save Changes to update your profile.
                  </p>
                </div>
              )}
            </form>
          </CardBody>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
