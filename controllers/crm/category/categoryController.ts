import { NextApiRequest , NextApiResponse } from "next";
import { addCategories, deleteCategories, getCategories, updateCategories } from "../../../models/crm/category/categoryModels";
import {  validationCreateCategory, validationRemoveCategory, validationUpdateCategory } from "../../../_lib_backend/validation/categoryValidation";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";

export const createCategory = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        
            const data:Category = zodValidatorHelper(validationCreateCategory,req.body,res);

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{categories:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}


            if(itemOwner.categories.length > 0 && itemOwner.categories.some((categoryId)=>categoryId.name === data.name)){
                return res.status(400).json({error:"Not allowed to duplicate name"})
            } 

            const newCategory = await addCategories(data);
            
            if(newCategory.success){
                return res.status(201).json({message:"created category successfully",createdCategory:newCategory.addedCategory})
            }else {
                return res.status(400).json({error:`${newCategory.error}`})
            }


    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

export const deleteCategory = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
            const data:removeCategory = zodValidatorHelper(validationRemoveCategory,req.body,res);

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{categories:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            console.log(typeof data.id);
            

            if(itemOwner.categories.length > 0 && !itemOwner.categories.some((categoryId)=>categoryId.id === data.id)){
                {return res.status(400).json({error:"Process of delete can not be complete because the category not exits "})}
            }

            const deleting = await deleteCategories(data)

            if (deleting.success) {
                return res.status(200).json({message:"Deleted a category successfully "})
            }else {
                return res.status(400).json({error:`${deleting.error}`})
            }


    } catch (error){
        return res.status(400).json({error:`Internal Server Error:${error}`})
    }



}

export const updateCategory= async (req:NextApiRequest, res:NextApiResponse) => {
    try {
            const data:Category = zodValidatorHelper(validationUpdateCategory,req.body,res);
            
            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{categories:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            const existingCategory = itemOwner.categories.find(category =>category.id === data.id);

            if (!existingCategory) {
                return res.status(400).json({error:"Category Id Not Found"})
            }

            if (itemOwner.categories.some(category =>category.name === data.name && category.id !== data.id))
            {
                return res.status(400).json({error:"Category name must be unique"})
            }

            if (existingCategory.name === data.name && existingCategory.description === data.description){
                return res.status(400).json({error:"Please change either the name or description"})
            } 

            if (existingCategory.name === data.name && existingCategory.description !== data.description){
                const updateResult = await  updateCategories(data);;
                
                if(updateResult.success){
                    return res.status(200).json({message:" Updated category successfully ",updatedCategory:updateResult.category})
                }else{
                    return res.status(400).json({error:updateResult.error})
                }
            }

            // to handle other cases 
            return res.status(200).json({message:" Updated category successfully "})

    } catch (error){
        return res.status(400).json({error:`Internal Server Error:${error}`})
    }



}

export const getCategory = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
            const tokenData = await decodeToken(req.headers.authorization);
            
            if(typeof tokenData !== "string"){
                return res.status(401).json({message:" Invalid token ",error:tokenData.error})
            }
            
            // tokenData all include the ownerId and it being passed to function.
            const get_categories = await getCategories(tokenData);

            if(get_categories.success){
                return res.status(200).json({message:" Fetched all categories successfully ",categories:get_categories.categories})
            } else {
                return res.status(400).json({error:get_categories.error})
            }

    } catch (error) {
        return res.status(400).json({error:`Internal Server Error:${error}`})
    }

}