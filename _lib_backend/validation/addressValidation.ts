import {z} from "zod"

//sizes section
export const validationCreateAddress = z.object({
    customerId: z.string().min(1),
    addressType: z.string().min(1,{message:"can not be empty "}),
    street: z.string().min(1,{message:"can not be empty "}),
    city: z.string().min(1,{message:"can not be empty "}),
    country: z.string().min(1,{message:"can not be empty "}),
    zipCode: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})

export const validationUpdateAddress = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    customerId: z.string().min(1),
    zipCode: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    addressType: z.string().min(1,{message:"can not be empty "}),
    street: z.string().min(1,{message:"can not be empty "}),
    city: z.string().min(1,{message:"can not be empty "}),
    country: z.string().min(1,{message:"can not be empty "}),
})

export const validationDeleteAddress = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    customerId: z.string().min(1),
})

// set To Default Address
export const validationSetToDefaultAddress = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    previousDefaultAddressId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    default: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val; 
    }, z.boolean().refine((val) => val === true, {
    message: "Value must be true"
    }))
})