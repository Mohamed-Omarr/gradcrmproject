import {  NextApiRequest, NextApiResponse } from "next";
import {  validationColorsOfProduct, validationCreateColors,  validationDeleteColors,  validationUpdateColors,  } from "../../../../_lib_backend/validation/attributesValidation";
import prisma from "../../../../_lib_backend/prismaClient/PrismaClient";
import { creating_colors, creating_product_color, deleting_colors, getting_colors, updating_colors, updating_product_color } from "../../../../models/crm/product/attributes/colorsModels";
import { normalizeToArray } from "../../../../_lib_backend/validation/zodHelper/normalized";
import { zodValidatorHelper } from "../../../../_lib_backend/validation/zodHelper/zodValidatorHelper";


export const createColor = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
        console.log("b4",req.body);
        
                const data:Colors = zodValidatorHelper(validationCreateColors,req.body,res)
        console.log("f4",data);
                
                const findAdmin = await prisma.admin.findUnique({where:{id:data.ownerId}})
                
                if(!findAdmin) {return res.status(400).json({error:"Admin Id Not Found"})}

                const create_colors = await creating_colors(data)

                if(create_colors.success){
                     return res.status(201).json({message:"Done successfully ",colors:create_colors.created_colors})
                 } else {
                     return res.status(500).json({error:create_colors.error})
                 }
          
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const updateColor = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const data:Colors = zodValidatorHelper(validationUpdateColors,req.body,res)

                const findColors = await prisma.colors.findUnique({where:{id:data.id,ownerId:data.ownerId}})
                
                if(!findColors) {return res.status(400).json({error:"Could not find owner Id or color Id"})}

                const update_colors = await updating_colors(data)
    
                 if(update_colors.success){
                     return res.status(200).json({message:" Updated successfully ",updatedColors:update_colors.updated_colors})
                 } else {
                     return res.status(500).json({error:update_colors.error})
                 }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const deleteColor = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const data:removeColors = zodValidatorHelper(validationDeleteColors,req.body,res)
                
                const findColors = await prisma.colors.findUnique({where:{id:data.id,ownerId:data.ownerId}})
                
                if(!findColors) {return res.status(400).json({error:"Could not find owner Id or color Id"})}

                 const delete_colors = await deleting_colors(data)
    
                 if(delete_colors.success){
                     return res.status(200).json({message:" Deleted successfully "})
                 } else {
                     return res.status(500).json({error:delete_colors.error})
                 }
         
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}


export const getColor = async (req:NextApiRequest ,res:NextApiResponse) => {
    try {
         
                            
                 const get_colors = await getting_colors()
    
                 if(get_colors.success){
                     return res.status(200).json({message:" Fetched successfully ",colors:get_colors.colors})
                 } else {
                     return res.status(500).json({error:get_colors.error})
                 }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}




// handle color attributes of product 

export const createColorOfProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const cleanData = normalizeToArray(req.body)
                
                const data:ColorOfProduct =  zodValidatorHelper(validationColorsOfProduct,cleanData,res)

                const created_colors = await creating_product_color(data)
    
                 if(created_colors.success){
                     return res.status(201).json({message:" Created successfully ",createdColors:created_colors.created_colors_for_product})
                 } else {
                     return res.status(500).json({error:created_colors.error})
                 }
           
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}

export const updateColorOfProduct = async ( req:NextApiRequest ,res:NextApiResponse  ) => {
    try {
                const cleanData = normalizeToArray(req.body)
                
                const data:ColorOfProduct =  zodValidatorHelper(validationColorsOfProduct,cleanData,res)

                const update_colors = await updating_product_color(data)
    
                 if(update_colors.success){
                     return res.status(200).json({message:" Updated successfully"})
                 } else {
                     return res.status(500).json({error:update_colors.error})
                 }
            
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}