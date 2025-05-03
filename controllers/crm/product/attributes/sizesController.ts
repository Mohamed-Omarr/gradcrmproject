import {  NextApiRequest, NextApiResponse } from "next";
import { validationCreateSizes, validationDeleteSizes, validationSizesOfProduct, validationUpdateSizes } from "../../../../_lib_backend/validation/attributesValidation";
import { creating_product_size, creating_sizes, deleting_sizes, getting_sizes, updating_product_size, updating_sizes } from "../../../../models/crm/product/attributes/sizesModels";
import prisma from "../../../../_lib_backend/prismaClient/PrismaClient";
import { normalizeToArray } from "../../../../_lib_backend/validation/zodHelper/normalized";
import { zodValidatorHelper } from "../../../../_lib_backend/validation/zodHelper/zodValidatorHelper";


export const createSize = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const data:Sizes = zodValidatorHelper(validationCreateSizes,req.body,res)

                // const findAdmin = await prisma.admin.findUnique({where:{id:data.ownerId}})
                
                // if(!findAdmin) {return res.status(400).json({error:"Admin Id Not Found"})}

                const create_sizes = await creating_sizes(data)

                if(create_sizes.success){
                     return res.status(201).json({message:"Done successfully ",sizes:create_sizes.created_sizes})
                 } else {
                     return res.status(500).json({error:create_sizes.error})
                 }
          
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const updateSize = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {

                const data:Sizes = zodValidatorHelper(validationUpdateSizes,req.body,res)

                const findSizes = await prisma.sizes.findUnique({where:{id:data.id}})
                
                if(!findSizes) {return res.status(400).json({error:"Sizes Id Not Found"})}

                const update_sizes = await updating_sizes(data)
    
                 if(update_sizes.success){
                     return res.status(200).json({message:" Updated successfully ",updatedSizes:update_sizes.updated_sizes})
                 } else {
                     return res.status(500).json({error:update_sizes.error})
                 }
          
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const deleteSize = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const data:removeSizes = zodValidatorHelper(validationDeleteSizes,req.body,res)

                 const delete_sizes = await deleting_sizes(data)
    
                 if(delete_sizes.success){
                     return res.status(204).json({message:" Deleted successfully "})
                 } else {
                     return res.status(500).json({error:delete_sizes.error})
                 }
          
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const getSize = async (res:NextApiResponse  ) => {
    try {
                 const get_sizes = await getting_sizes()
    
                 if(get_sizes.success){
                     return res.status(200).json({message:" Fetched successfully ",sizes:get_sizes.sizes})
                 } else {
                     return res.status(500).json({error:get_sizes.error})
                 }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}




// handle size attributes of product 
export const createSizeOfProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const cleanData = normalizeToArray(req.body)
                
                const data:SizeOfProduct = zodValidatorHelper(validationSizesOfProduct,cleanData,res)

                const created_sizes = await creating_product_size(data)
    
                 if(created_sizes.success){
                     return res.status(201).json({message:" Created successfully ",createdSizes:created_sizes.created_sizes_for_product})
                 } else {
                     return res.status(500).json({error:created_sizes.error})
                 }
           
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}

export const updateSizeOfProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const cleanData = normalizeToArray(req.body)
                
                const data:SizeOfProduct = zodValidatorHelper(validationSizesOfProduct,cleanData,res);

                const update_sizes = await updating_product_size(data)
    
                 if(update_sizes.success){
                     return res.status(200).json({message:" Updated successfully ",updatedSizes:update_sizes.updated_sizes_for_product})
                 } else {
                     return res.status(500).json({error:update_sizes.error})
                 }
          
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}

