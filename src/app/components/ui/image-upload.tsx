// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\ui\image-upload.tsx
"use client";

import NextImage from "next/image";
// Renamed to avoid confusion
import { useCallback, useState } from "react";

import { Input, Spinner } from "@nextui-org/react";
import { IconPhotoPlus } from "@tabler/icons-react";
import { UseFormRegister, UseFormSetError } from "react-hook-form";

import { UserProfileFormData } from "@/lib/schemas/user-profile";

// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\ui\image-upload.tsx

// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\ui\image-upload.tsx

interface ImageUploadProps {
  currentImage?: string;
  register: UseFormRegister<UserProfileFormData>;
  name: keyof UserProfileFormData;
  errorMessage?: string;
  setError: UseFormSetError<UserProfileFormData>;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGE_DIMENSIONS = {
  width: 2048,
  height: 2048,
};
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ImageUpload({
  currentImage,
  register,
  name,
  errorMessage,
  setError,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useState(false);

  const validateImage = useCallback(
    (file: File): Promise<boolean> => {
      return new Promise(resolve => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          setError(name, {
            type: "manual",
            message: `Image must be less than 2MB (current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
          });
          return resolve(false);
        }

        // Check file type
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setError(name, {
            type: "manual",
            message: `Only JPG, PNG and WebP images are allowed (received: ${file.type})`,
          });
          return resolve(false);
        }

        // Check dimensions using native HTML Image
        const img = new globalThis.Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (img.width > MAX_IMAGE_DIMENSIONS.width || img.height > MAX_IMAGE_DIMENSIONS.height) {
            setError(name, {
              type: "manual",
              message: `Image dimensions must be less than ${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height} (received: ${img.width}x${img.height})`,
            });
            resolve(false);
          } else {
            resolve(true);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          setError(name, {
            type: "manual",
            message: "Failed to load image. The file may be corrupted or in an unsupported format.",
          });
          resolve(false);
        };
      });
    },
    [setError, name]
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const isValid = await validateImage(file);
      if (isValid) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        e.target.value = ""; // Reset input
        setPreviewUrl(currentImage); // Restore previous preview
      }
    } catch (error) {
      setError(name, {
        type: "manual",
        message: "Failed to process image. Please try another file.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-200 sm:mx-0 sm:h-32 sm:w-32">
          {previewUrl ? (
            <NextImage
              src={previewUrl}
              alt="Profile preview"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 96px, 128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <IconPhotoPlus className="h-8 w-8 text-gray-400" />
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Spinner size="sm" color="white" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="mb-2 text-sm font-medium">Profile Photo</div>
          <div className="mb-2 text-xs text-gray-500">
            Select a square image in JPG, PNG, or WebP format (max 2MB)
          </div>
          <Input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            {...register(name, {
              onChange: handleImageChange,
            })}
            isDisabled={isLoading}
            className="max-w-full"
            classNames={{
              input: "cursor-pointer",
            }}
          />
          {errorMessage && <p className="text-danger mt-2 text-sm">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
