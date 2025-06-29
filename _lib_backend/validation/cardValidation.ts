import { z } from "zod";

const CardTypeEnum = z.enum(["VISA", "MASTERCARD"]);

export const ValidateCreateCard = z.object({
  type: CardTypeEnum,
number: z
  .string()
  .length(4, "Card number must be exactly 4 digits")
  .regex(/^\d{4}$/, "Card number must contain exactly 4 digits"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  default: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val; 
    }, z.boolean({message:"must be boolean"})), 
})

// export const ValidateUpdateCard = z.object({
//   type: CardTypeEnum,
//   number: z
//   .string()
//   .length(4, "Card number must be exactly 4 digits")
//   .regex(/^\d{4}$/, "Card number must contain exactly 4 digits"),

//   expiry: z
//     .string()
//     .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
// })

export const validationDeleteCard = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    customerId: z.string().uuid("Invalid customer ID format"),
})

// set To Default Card
export const validationSetToDefaultCard = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    previousDefaultCardId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    default: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val; 
    }, z.boolean().refine((val) => val === true, {
    message: "Value must be true"
    }))
})

