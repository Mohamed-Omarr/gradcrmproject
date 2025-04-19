import {z} from "zod"

export const  validationCreateProduct = z.object({
    name: z.string().min(1,{message:"can not be empty "}),
    price: z.string().min(1,{message:"must be at least 1 value"}),
    description: z.string().min(1).optional(),
    ownerId: z.string().min(1),
    qty: z.string().min(1)
})

export const validationRemoveProduct = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    ownerId: z.string().min(1)
})


export const validationUpdateProduct = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    name: z.string().min(1,{message:"can not be empty"}),
    price: z.string().min(1),
    description: z.string().min(1).optional(),
    ownerId: z.string().min(1)
})


