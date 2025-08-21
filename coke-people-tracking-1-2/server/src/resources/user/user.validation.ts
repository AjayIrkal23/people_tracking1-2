import { z } from "zod";

export const RegisterUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER"]),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
