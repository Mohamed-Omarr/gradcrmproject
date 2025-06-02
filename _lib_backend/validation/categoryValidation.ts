import {z} from "zod"

export const  validationCreateCategory = z.object({
    name: z.string().min(1,{message:"can not be empty "}).regex(/^[A-Za-z\s]+$/, { message: 'Name must contain only letters and spaces' }),
    description: z.string().optional(),
    ownerId: z.string().min(1),
})

export const validationRemoveCategory = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    ownerId: z.string().min(1)
})


export const validationUpdateCategory = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    name: z.string().min(1,{message:"can not be empty"}).regex(/^[A-Za-z\s]+$/, { message: 'Name must contain only letters and spaces' }).optional(),
    description: z.string().optional(),
    ownerId: z.string().min(1)
})

export const  validationGetCategory = z.object({
    ownerId: z.string().min(1),
})

