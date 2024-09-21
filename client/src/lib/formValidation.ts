import { UserType } from "@/types";
import { z, ZodType } from "zod";


export const signupSchema: ZodType<UserType> = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, { message: "Username must be at least 2 characters long!" })
      .max(100, { message: "Username cannot exceed 100 characters!" }),
    email: z.string().email(),
    password: z
      .string()
      .min(5)
      .max(30)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
      ),
    confirmPassword: z.string().min(5).max(30),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


  export const loginSchema: ZodType<UserType> = z
    .object({
      email: z.string().email(),
      password: z
        .string()
        .min(5)
        .max(30)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
        )
    })

  export const emailOnlySchema: ZodType<UserType> = z.object({
    email: z.string().email(),
  });    
    