import {z} from "zod"

export const  validationCreateStock = z.object({
    name: z.string().min(1,{message:"can not be empty "}),
    categoryId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    ownerId: z.string().min(1),
    description: z.string().min(1).optional(),
})

export const validationRemoveStock = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    ownerId: z.string().min(1)
})


export const validationUpdateStock = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    name: z.string().min(1,{message:"can not be empty"}).optional(),
    description: z.string().min(1).optional(),
    categoryId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})).optional(),
    ownerId: z.string().min(1)
})

export const validationGetStock = z.object({
    ownerId: z.string().min(1)
})

