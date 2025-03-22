import { z } from "zod";

// Schema for username validation
const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, periods, underscores, and hyphens"
    )
    .refine(value => !value.includes(" "), "Username cannot contain spaces"),
});
