import {z} from "zod"

//sizes section
export const validationCreateSizes = z.object({
    name: z.string().min(1,{message:"can not be empty "}),
    code: z.string().min(1,{message:"can not be empty "}),
})

export const validationUpdateSizes = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    name: z.string().optional(),
    code: z.string().optional(),
})

export const validationDeleteSizes = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
})


// colors section
export const validationCreateColors = z.object({
    name: z.string().min(1,{message:"can not be empty "}),
    code: z.string().min(1,{message:"can not be empty "}),
})

export const validationUpdateColors = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    name: z.string().optional(),
    code: z.string().optional(),
    ownerId: z.string().min(1),
})


export const validationDeleteColors = z.object({
    id: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
    ownerId: z.string().min(1),
})




//sizes section of product
export const validationSizesOfProduct = z.object({
  sizeIds: z.number().array(),
  productId: z.preprocess(
    val => Number(val),
    z.number({
      message: "type of id must be a number"
    }).int({ message: "must be integer" })
     .positive({ message: "must be positive number" })
  ),
});

//colors section of product
export const validationColorsOfProduct = z.object({
    colorIds: z.number().array(),
    productId: z.preprocess(
      val => Number(val),
      z.number({
        message: "type of id must be a number"
      }).int({ message: "must be integer" })
       .positive({ message: "must be positive number" })
    ),
  });