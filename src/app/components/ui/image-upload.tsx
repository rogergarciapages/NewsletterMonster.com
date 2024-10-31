"use client";

import { UserProfileFormData } from "@/lib/schemas/user-profile";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface ImageUploadProps {
  currentImage?: string;
  register: UseFormRegister<UserProfileFormData>;
  name: keyof UserProfileFormData;
  errorMessage?: string;
}

export default function ImageUpload({ currentImage, register, name, errorMessage }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {previewUrl && (
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image
            src={previewUrl}
            alt="Profile preview"
            fill
            className="object-cover"
          />
        </div>
      )}
      <Input
        type="file"
        label="Profile Photo"
        accept="image/*"
        {...register(name, {
          onChange: handleImageChange
        })}
        errorMessage={errorMessage}
        className="flex-grow"
      />
    </div>
  );
}