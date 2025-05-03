import {  NextApiRequest, NextApiResponse } from "next";
import { creating_rate, deleting_rate, updating_rate } from "../../../models/shop/product/rateModels";
import { validationCreateProductRate, validationDeleteProductRate, validationUpdateProductRate } from "../../../_lib_backend/validation/productValidation";
import { ZodError } from "zod";
import { formatZodError } from "../../../_lib_backend/validation/zodHelper/zodError";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";


export const createRateForProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
        const data:Rate = req.body;
            try {
                validationCreateProductRate.parse(data);
                

                const findCustomer = await prisma.customer.findUnique({where:{id:data.customerId}})
                
                if(!findCustomer) {return res.status(400).json({error:"Customer Id Not Found"})}

                const create_rate = await creating_rate(data)
                
                if(create_rate.success){
                     return res.status(200).json({message:"Done successfully ",ratedProduct:create_rate.created_rate})
                 } else {
                     return res.status(500).json({error:create_rate.error})
                 }
            }catch(error) {
             if(error instanceof ZodError) {
                               return res.status(400).json({error:formatZodError(error)})
                           }
                           return res.status(400).json({error:`validation Failed: ${error}`})
            }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const updateRateOfProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
        const data:Rate = req.body;
            try {
                validationUpdateProductRate.parse(data);

                const findCustomer = await prisma.customer.findUnique({where:{id:data.customerId}})
                
                if(!findCustomer) {return res.status(400).json({error:"Customer Id Not Found"})}

                const findRate = await prisma.rating.findUnique({where:{id:data.id}})
                
                if(!findRate) {return res.status(400).json({error:"Rate Id Not Found"})}

                const update_rate = await updating_rate(data)
    
                 if(update_rate.success){
                     return res.status(200).json({message:" Updated successfully ",updatedRate:update_rate.updated_rate})
                 } else {
                     return res.status(500).json({error:update_rate.error})
                 }
            }catch(error) {
             if(error instanceof ZodError) {
                               return res.status(400).json({error:formatZodError(error)})
                           }
                           return res.status(400).json({error:`validation Failed: ${error}`})
            }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const deleteRateOfProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
        const data:Rate = req.body;
            try {
                validationDeleteProductRate.parse(data);

                const findCustomer = await prisma.customer.findUnique({where:{id:data.customerId}})
                
                if(!findCustomer) {return res.status(400).json({error:"Customer Id Not Found"})}

                 const update_rate = await deleting_rate(data)
    
                 if(update_rate.success){
                     return res.status(204).json({message:" Deleted successfully "})
                 } else {
                     return res.status(500).json({error:update_rate.error})
                 }
            }catch(error) {
             if(error instanceof ZodError) {
                               return res.status(400).json({error:formatZodError(error)})
                           }
                           return res.status(400).json({error:`validation Failed: ${error}`})
            }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


