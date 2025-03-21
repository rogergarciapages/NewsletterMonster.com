import { Button, Input, Tooltip } from "@nextui-org/react";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconRefresh,
} from "@tabler/icons-react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";

import { SocialLinksFormData } from "@/lib/schemas/user-profile";

interface SocialLinksFormProps {
  formMethods: {
    register: UseFormRegister<SocialLinksFormData>;
    control: Control<SocialLinksFormData>;
    formState: {
      errors: FieldErrors<SocialLinksFormData>;
      dirtyFields: Partial<Record<keyof SocialLinksFormData, boolean>>;
    };
  };
  onReset: (field: keyof SocialLinksFormData) => void;
}

// Normalize input values for each platform
const normalizeTwitter = (value: string): string => {
  if (!value) return "";
  // Remove '@' prefix if present
  if (value.startsWith("@")) return value.substring(1);
  // Extract username from URL
  const twitterRegex = /(?:twitter\.com|x\.com)\/(?:#!\/)?@?([^/?#]+)/;
  const match = value.match(twitterRegex);
  return match ? match[1] : value;
};

const normalizeInstagram = (value: string): string => {
  if (!value) return "";
  // Remove '@' prefix if present
  if (value.startsWith("@")) return value.substring(1);
  // Extract username from URL
  const instagramRegex = /(?:instagram\.com)\/(?:#!\/)?@?([^/?#]+)/;
  const match = value.match(instagramRegex);
  return match ? match[1] : value;
};

const normalizeLinkedin = (value: string): string => {
  if (!value) return "";
  // Check if it's already a URL
  if (value.match(/^https?:\/\//)) return value;
  // Check if it's a linkedin.com/in/username format without protocol
  if (value.startsWith("linkedin.com/")) return `https://${value}`;
  // If just a username, convert to full URL
  if (!value.includes("/")) return `https://linkedin.com/in/${value}`;
  // Otherwise, return as is with protocol
  return `https://${value.replace(/^https?:\/\//, "")}`;
};

const normalizeYoutube = (value: string): string => {
  if (!value) return "";
  // Check if it's already a URL
  if (value.match(/^https?:\/\//)) return value;
  // Handle channel ID or username
  if (value.startsWith("@")) return `https://youtube.com/${value}`;
  if (!value.includes("/")) return `https://youtube.com/c/${value}`;
  // Otherwise, return as is with protocol
  return `https://${value.replace(/^https?:\/\//, "")}`;
};

const normalizeGithub = (value: string): string => {
  if (!value) return "";
  // Remove '@' prefix if present
  if (value.startsWith("@")) return value.substring(1);
  // Extract username from URL
  const githubRegex = /(?:github\.com)\/(?:#!\/)?@?([^/?#]+)/;
  const match = value.match(githubRegex);
  return match ? match[1] : value;
};

export default function SocialLinksForm({ formMethods, onReset }: SocialLinksFormProps) {
  const {
    register,
    control,
    formState: { errors, dirtyFields },
  } = formMethods;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Social Media Profiles</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <Controller
            name="twitter"
            control={control}
            render={({ field }) => (
              <Input
                label="Twitter Username"
                id="twitter"
                startContent={<IconBrandTwitter size={18} className="text-[#1DA1F2]" />}
                errorMessage={errors.twitter?.message}
                placeholder="@username or profile URL"
                description="We'll extract the username automatically"
                aria-invalid={!!errors.twitter}
                isInvalid={!!errors.twitter}
                value={field.value || ""}
                onChange={e => field.onChange(normalizeTwitter(e.target.value))}
                onBlur={field.onBlur}
                endContent={
                  dirtyFields.twitter && (
                    <Tooltip content="Reset to original value">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onReset("twitter")}
                        aria-label="Reset Twitter username field"
                      >
                        <IconRefresh size={18} />
                      </Button>
                    </Tooltip>
                  )
                }
              />
            )}
          />
        </div>

        <div className="relative">
          <Controller
            name="instagram"
            control={control}
            render={({ field }) => (
              <Input
                label="Instagram Username"
                id="instagram"
                startContent={<IconBrandInstagram size={18} className="text-[#E4405F]" />}
                errorMessage={errors.instagram?.message}
                placeholder="@username or profile URL"
                description="We'll extract the username automatically"
                aria-invalid={!!errors.instagram}
                isInvalid={!!errors.instagram}
                value={field.value || ""}
                onChange={e => field.onChange(normalizeInstagram(e.target.value))}
                onBlur={field.onBlur}
                endContent={
                  dirtyFields.instagram && (
                    <Tooltip content="Reset to original value">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onReset("instagram")}
                        aria-label="Reset Instagram username field"
                      >
                        <IconRefresh size={18} />
                      </Button>
                    </Tooltip>
                  )
                }
              />
            )}
          />
        </div>

        <div className="relative">
          <Controller
            name="linkedin"
            control={control}
            render={({ field }) => (
              <Input
                label="LinkedIn Profile"
                id="linkedin"
                startContent={<IconBrandLinkedin size={18} className="text-[#0A66C2]" />}
                placeholder="Username or profile URL"
                errorMessage={errors.linkedin?.message}
                description="We'll format the URL automatically"
                aria-invalid={!!errors.linkedin}
                isInvalid={!!errors.linkedin}
                value={field.value || ""}
                onChange={e => field.onChange(normalizeLinkedin(e.target.value))}
                onBlur={field.onBlur}
                endContent={
                  dirtyFields.linkedin && (
                    <Tooltip content="Reset to original value">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onReset("linkedin")}
                        aria-label="Reset LinkedIn URL field"
                      >
                        <IconRefresh size={18} />
                      </Button>
                    </Tooltip>
                  )
                }
              />
            )}
          />
        </div>

        <div className="relative">
          <Controller
            name="youtube"
            control={control}
            render={({ field }) => (
              <Input
                label="YouTube Channel"
                id="youtube"
                startContent={<IconBrandYoutube size={18} className="text-[#FF0000]" />}
                placeholder="@channel or channel URL"
                errorMessage={errors.youtube?.message}
                description="We'll format the URL automatically"
                aria-invalid={!!errors.youtube}
                isInvalid={!!errors.youtube}
                value={field.value || ""}
                onChange={e => field.onChange(normalizeYoutube(e.target.value))}
                onBlur={field.onBlur}
                endContent={
                  dirtyFields.youtube && (
                    <Tooltip content="Reset to original value">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onReset("youtube")}
                        aria-label="Reset YouTube Channel field"
                      >
                        <IconRefresh size={18} />
                      </Button>
                    </Tooltip>
                  )
                }
              />
            )}
          />
        </div>

        <div className="relative">
          <Controller
            name="github"
            control={control}
            render={({ field }) => (
              <Input
                label="GitHub Username"
                id="github"
                startContent={<IconBrandGithub size={18} />}
                placeholder="Username or profile URL"
                errorMessage={errors.github?.message}
                description="We'll extract the username automatically"
                aria-invalid={!!errors.github}
                isInvalid={!!errors.github}
                value={field.value || ""}
                onChange={e => field.onChange(normalizeGithub(e.target.value))}
                onBlur={field.onBlur}
                endContent={
                  dirtyFields.github && (
                    <Tooltip content="Reset to original value">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onReset("github")}
                        aria-label="Reset GitHub username field"
                      >
                        <IconRefresh size={18} />
                      </Button>
                    </Tooltip>
                  )
                }
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
