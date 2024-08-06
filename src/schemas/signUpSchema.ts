
import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username should be atleast 3 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username should only contain alphabets and numbers");

export const passwordValidation = z
    .string()
    .min(6, "Password should be atleast 6 characters long");

export const signUpSchema = z.object({
    username: usernameValidation,
    password: passwordValidation
});