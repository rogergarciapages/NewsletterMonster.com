// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\ui\image-upload.tsx
"use client";

import { UserProfileFormData } from "@/lib/schemas/user-profile";
import { Input, Spinner } from "@nextui-org/react";
import NextImage from "next/image"; // Renamed to avoid confusion
import { useCallback, useState } from "react";
import { UseFormRegister, UseFormSetError } from "react-hook-form";

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
  height: 2048
};
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ImageUpload({ 
  currentImage, 
  register, 
  name, 
  errorMessage,
  setError 
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useState(false);

  const validateImage = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(name, {
          type: "manual",
          message: "Image must be less than 2MB"
        });
        return resolve(false);
      }

      // Check file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError(name, {
          type: "manual",
          message: "Only JPG, PNG and WebP images are allowed"
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
            message: `Image dimensions must be less than ${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height}`
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
          message: "Failed to load image"
        });
        resolve(false);
      };
    });
  }, [setError, name]);

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
      console.error("Error validating image:", error);
      setError(name, {
        type: "manual",
        message: "Failed to process image"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          {previewUrl ? (
            <NextImage
              src={previewUrl}
              alt="Profile preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">+</span>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Spinner size="sm" color="white" />
            </div>
          )}
        </div>
        <Input
          type="file"
          label="Profile Photo"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          {...register(name, {
            onChange: handleImageChange
          })}
          errorMessage={errorMessage}
          className="flex-grow"
          isDisabled={isLoading}
        />
      </div>
      {errorMessage && (
        <p className="text-sm text-danger mt-1">{errorMessage}</p>
      )}
    </div>
  );
}