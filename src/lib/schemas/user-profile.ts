// src/lib/schemas/user-profile.ts
import { z } from "zod";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Schema for the User table data
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, periods, underscores, and hyphens"
    )
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  profile_photo: z
    .custom<FileList>()
    .optional()
    .refine(
      files => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      "Max file size is 2MB"
    )
    .refine(
      files => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

// Schema for social links data that goes in the SocialLinks table
export const socialLinksSchema = z.object({
  twitter: z
    .string()
    .max(15, "Twitter username must be less than 15 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Twitter username can only contain letters, numbers, and underscores")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .max(30, "Instagram username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Instagram username can only contain letters, numbers, periods, and underscores"
    )
    .optional()
    .or(z.literal("")),
  linkedin: z.string().url("LinkedIn must be a valid URL").optional().or(z.literal("")),
  youtube: z.string().url("YouTube channel must be a valid URL").optional().or(z.literal("")),
  facebook: z.string().url("Facebook URL must be a valid URL").optional().or(z.literal("")),
  github: z
    .string()
    .max(39, "GitHub username must be less than 39 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "GitHub username can only contain letters, numbers, and hyphens")
    .optional()
    .or(z.literal("")),
});

// Combined schema for forms that need to update both User and SocialLinks data
export const userProfileWithSocialSchema = userProfileSchema.extend({
  socialLinks: socialLinksSchema,
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type SocialLinksFormData = z.infer<typeof socialLinksSchema>;
export type UserProfileWithSocialFormData = z.infer<typeof userProfileWithSocialSchema>;
