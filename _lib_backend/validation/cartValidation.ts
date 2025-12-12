import {z} from "zod"

export const validationAddToCartItems = z.object({
        productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of product Id must be a number"}).positive({message:"must be positive number"})),
        color: z.string()
        .min(1, { message: "Color cannot be empty" })
        .regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, {
        message: "Color must be a valid hex code (e.g., #000 or #ffffff)",
        }),
        size: z.string().min(1,{message:"can not be empty "}).regex(/^[A-Za-z\s]+$/, { message: 'Name must contain only letters and spaces' }),
        quantity: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})

export const validationUpdateCartItems = z.object({
        id: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
        productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of product Id must be a number"}).positive({message:"must be positive number"})),
        quantity: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})

export const validationRemoveFromCartItems = z.object({
        id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})