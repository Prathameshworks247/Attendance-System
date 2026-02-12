import { z } from "zod";

export const nameValidation = z
  .string()
  .min(3, { message: "name must be at least 3 chars" })
  .max(15, { message: "name must be at max 15 chars" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "name must only contain letters, numbers and underscores",
  });

export const passwordValidation = z
  .string()
  .min(8, { message: "password must be at least 8 chars" })
  .max(50, { message: "password cannot be more than 50 chars" })
  .regex(/[A-Z]/, { message: "password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "password must contain at least one number" })
  .regex(/[\W_]/, { message: "password must contain at least one special character" });

export const loginSchema = z.object({
  email: z.string().email({message:"Invalid Email Adresses"}),
  password: passwordValidation,
});

export const signUpSchema = z.object({
  name: nameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: passwordValidation,
  role: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Role must be either student or teacher" }),
  }),
});

export const classSchema = z.object({
  className: z.string()
});
