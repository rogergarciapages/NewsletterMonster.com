import { Button, Input, Tooltip } from "@nextui-org/react";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconRefresh,
} from "@tabler/icons-react";
import { UseFormReturn } from "react-hook-form";

import { SocialLinksFormData } from "@/lib/schemas/user-profile";

interface SocialLinksFormProps {
  formMethods: UseFormReturn<SocialLinksFormData>;
  onReset: (field: keyof SocialLinksFormData) => void;
}

export default function SocialLinksForm({ formMethods, onReset }: SocialLinksFormProps) {
  const {
    register,
    formState: { errors, dirtyFields },
  } = formMethods;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Social Media Profiles</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <Input
            label="Twitter Username"
            {...register("twitter")}
            id="twitter"
            startContent={<IconBrandTwitter size={18} className="text-[#1DA1F2]" />}
            errorMessage={errors.twitter?.message}
            placeholder="username"
            description="Without the @ symbol"
            aria-invalid={!!errors.twitter}
            isInvalid={!!errors.twitter}
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
        </div>

        <div className="relative">
          <Input
            label="Instagram Username"
            {...register("instagram")}
            id="instagram"
            startContent={<IconBrandInstagram size={18} className="text-[#E4405F]" />}
            errorMessage={errors.instagram?.message}
            placeholder="username"
            description="Without the @ symbol"
            aria-invalid={!!errors.instagram}
            isInvalid={!!errors.instagram}
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
        </div>

        <div className="relative">
          <Input
            label="LinkedIn URL"
            {...register("linkedin")}
            id="linkedin"
            startContent={<IconBrandLinkedin size={19} className="text-[#0A66C2]" />}
            placeholder="https://linkedin.com/in/yourprofile"
            errorMessage={errors.linkedin?.message}
            description="Full URL to your LinkedIn profile"
            aria-invalid={!!errors.linkedin}
            isInvalid={!!errors.linkedin}
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
        </div>

        <div className="relative">
          <Input
            label="YouTube Channel URL"
            {...register("youtube")}
            id="youtube"
            startContent={<IconBrandYoutube size={18} className="text-[#FF0000]" />}
            placeholder="https://youtube.com/c/yourchannel"
            errorMessage={errors.youtube?.message}
            description="Full URL to your YouTube channel"
            aria-invalid={!!errors.youtube}
            isInvalid={!!errors.youtube}
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
        </div>

        <div className="relative">
          <Input
            label="GitHub Username"
            {...register("github")}
            id="github"
            startContent={<IconBrandGithub size={18} />}
            placeholder="username"
            errorMessage={errors.github?.message}
            description="Your GitHub username"
            aria-invalid={!!errors.github}
            isInvalid={!!errors.github}
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
        </div>
      </div>
    </div>
  );
}
