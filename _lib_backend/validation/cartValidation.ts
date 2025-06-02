import {z} from "zod"

export const validationAddToCartItems = z.object({
        productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of product Id must be a number"}).positive({message:"must be positive number"})),
        quantity: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
        total: z.preprocess((val)=>Number(val) ,z.number({message:"total must be a number"}).positive({message:"must be positive number"})),
})

export const validationRemoveFromCartItems = z.object({
        Id: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
        productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of product Id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})