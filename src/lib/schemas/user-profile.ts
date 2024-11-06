// src/lib/schemas/user-profile.ts
import { z } from "zod";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().optional(),
  company_name: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website_domain: z
    .string()
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      "Must be a valid domain (e.g., company.com)"
    )
    .optional()
    .or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  date_of_birth: z.date().optional(),
  twitter_username: z
    .string()
    .regex(/^[a-zA-Z0-9_]{1,15}$/, "Invalid Twitter username")
    .optional()
    .or(z.literal("")),
  instagram_username: z
    .string()
    .regex(/^[a-zA-Z0-9_.]{1,30}$/, "Invalid Instagram username")
    .optional()
    .or(z.literal("")),
  youtube_channel: z.string().url("Must be a valid YouTube URL").optional().or(z.literal("")),
  linkedin_profile: z.string().url("Must be a valid LinkedIn URL").optional().or(z.literal("")),
  facebook_url: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/(?:www\.)?facebook\.com\//i, "Must be a valid Facebook URL")
    .optional()
    .or(z.literal("")),
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

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
