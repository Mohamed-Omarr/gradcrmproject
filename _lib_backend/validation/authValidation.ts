import { z } from "zod";

export const ValidateUserRegister = z.object({
    email: z.string().email("Invalid email address").min(1,{message:"Email is required"}),
    name: z.string().min(2, {message: "Must be at  least 2 or more characters long"}).max(30,{message: "Must be less than 30 characters"}),
    password: z.string().min(8,{message:"Must be at least 8 characters"}),
    confirmPassword: z.string().min(8,{message:"Must be at least 8 characters"})
}).refine((data)=>data.password === data.confirmPassword , {
    message: "Password and confirmPassword must match",
    path: ["confirmPassword"]
})

export const ValidateUserLogin = z.object({
    email: z.string().email("Invalid email address").min(1,{message:"Email is required"}),
    password: z.string().min(8,{message:"Must be at least 8 characters"}),
})
