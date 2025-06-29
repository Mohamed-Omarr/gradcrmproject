import { z } from "zod";

// shop section
export const ValidateCreateOrder = z.object({
  stripePaymentIntentId: z.string(),
  customerId: z.string(),
  total: z.preprocess((val)=>Number(val) ,z.number().int().nonnegative()),  // in cents
  currency: z.literal("usd"),
  orderItem: z
    .array(
      z.object({
        productId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
        name: z.string(),
        color: z.string(),
        size: z.string(),
        quantity: z.preprocess((val)=>Number(val) ,z.number({message:"type of qty must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
        price: z.preprocess((val)=>Number(val) ,z.number({message:"type of price must be a number"}).positive({message:"must be positive number"})),
        image: z
          .string()
          .refine((val) => val.startsWith("/uploads/"), {
            message: "Image path must start with /uploads/",
          })
      })
    )
    .min(1, "At least one item is required"),
});



// CRM section
export const ValidateUpdateOrderStatus = z.object({
  orderId: z.preprocess((val)=>Number(val) ,z.number({message:"type of id must be a number"}).int({message:"must be integer"}).positive({message:"must be positive number"})),
  newStatus: z.enum(["processing", "accepted"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
});
