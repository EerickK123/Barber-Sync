import { z } from "zod";

export const createUserSchema = z.object({
  user_name: z.string().trim().min(2).max(128),
  user_lastname: z.string().trim().min(2).max(128),
  user_email: z.email(),
  user_password: z.string().min(6).max(128),
  user_phone: z
    .string()
    .min(7)
    .max(15)
    .regex(/^[0-9+]+$/),
});