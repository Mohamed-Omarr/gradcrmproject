import {z} from "zod"

export const  validationCreateProduct = z.object({
    name: z.string().min(1,{message:"can not be empty "}),
    price: z.preprocess((val)=>Number(val) ,z.number({message:"type of price must be a number"}).positive({message:"must be positive number"})),
    description: z.string().optional(),
    ownerId: z.string().min(1),
    qty: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    colorId: z.number({message:"type of price must be a number"}).positive({message:"must be positive number"}),
    sizeId: z.preprocess((val)=>Number(val) ,z.number({message:"type of price must be a number"}).positive({message:"must be positive number"})),
    categoryId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})

export const validationRemoveProduct = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    ownerId: z.string().min(1)
})


export const validationUpdateProduct = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    name: z.string().min(1,{message:"can not be empty"}),
    price: z.preprocess((val)=>Number(val) ,z.number({message:"type of price must be a number"}).positive({message:"must be positive number"})),
    qty: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    description: z.string().optional(),
    ownerId: z.string().min(1),
    colorId: z.preprocess((val)=>Number(val) ,z.number({message:"type of price must be a number"}).positive({message:"must be positive number"})),
    sizeId: z.preprocess((val)=>Number(val) ,z.number({message:"type of price must be a number"}).positive({message:"must be positive number"})),
    categoryId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})


// Shope Site
export const validationCreateProductRate = z.object({
    productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    customerId: z.string().min(1),
    score: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).positive({message:"must be positive number"})),
    review: z.string().optional(),
})

export const validationUpdateProductRate = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    customerId: z.string().min(1),
    score: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).positive({message:"must be positive number"})),
    review: z.string().optional(),
})

export const validationDeleteProductRate = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    customerId: z.string().min(1),
})


