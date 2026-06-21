import { z } from "zod";

// Sign In
export const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignInIndex = z.infer<typeof SignInSchema>;

// Sign Up
export const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(30),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignUpIndex = z.infer<typeof SignUpSchema>;
