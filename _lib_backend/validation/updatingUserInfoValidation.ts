import {z} from "zod"

export const  validationUpdateUsername = z.object({
  id: z.string().uuid({ message: "Invalid ID format. Must be a valid UUID." }),
    previousName: z.string().min(1,{message:"can not be empty"}),
    newName: z.string().min(1,{message:"can not be empty"}),
}).refine((data)=>data.newName !== data.previousName,{
    message:"current name can not be same as new name ",
    path: ["newName"],
});

export const validationUpdateEmail = z.object({
  id: z.string().uuid({ message: "Invalid ID format. Must be a valid UUID." }),
    previousEmail: z.string().email({message:"Invalid email address"}).min(1,{message:"Email is required"}),
    newEmail: z.string().email({message:"Invalid email address"}).min(1,{message:"Email is required"}),
    password: z.string().min(8,{message:"Must be at least 8 characters"}),
}).refine((data)=>data.newEmail !== data.previousEmail,{
    message:"current email can not be same as new email ",
    path: ["newEmail"],
});


export const validationUpdatePassword = z.object({
  id: z.string().uuid({ message: "Invalid ID format. Must be a valid UUID." }),
  email: z.string().email({message:"Invalid email address"}).min(1,{message:"Email is required"}),
  currentPassword: z.string().min(8, { message: "Must be at least 8 characters" }),
  newPassword: z.string().min(8, { message: "Must be at least 8 characters" }),
  confirmNewPassword: z.string().min(8, { message: "Must be at least 8 characters" }),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
  message: " New password and confirm password must match",
  path: ["confirmNewPassword"],
})
.refine((data) => data.newPassword !== data.currentPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
})




