import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(16, "Username must be less than 16 characters long")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username must contain only letters and numbers"
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain double dashes"
    )
    .transform((val) => val.toLocaleLowerCase()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
