import { NextApiRequest , NextApiResponse } from "next";
import { addProducts, deleteProducts, getProducts, updateProducts } from "../../../models/crm/product/productModels";
import { validationCreateProduct, validationRemoveProduct, validationUpdateProduct } from "../../../_lib_backend/validation/productValidation";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { normalizeFormFields } from "../../../_lib_backend/validation/zodHelper/normalized";
import { supabase } from "@/lib/supabase/supabase";
import { parseFormInMemory } from "../../../_lib_backend/uploaderHelper/handleUploader";
import fs from 'fs/promises';

export const createProduct = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        const { fields, files } = await parseFormInMemory(req);

        const cleanData = normalizeFormFields(fields)

            const data:Product = zodValidatorHelper(validationCreateProduct,cleanData,res);
            
            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{products:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            const scanToCompare = itemOwner.products.map((info)=>info);

            if(scanToCompare.length > 0 && scanToCompare.some((product)=>product.name === data.name)){
                return res.status(400).json({error:"Not allowed to duplicate name"})
            }
            
            if(scanToCompare.length > 0 && !scanToCompare.some((product)=>product.categoryId)){
                return res.status(400).json({error:"Failed the selected category Id Not Found"})
            }

                // Read file buffer from uploaded file
    const thumbnailFileRaw = files.thumbnail;
const thumbnailFile = Array.isArray(thumbnailFileRaw) ? thumbnailFileRaw[0] : thumbnailFileRaw;

if (!thumbnailFile) {
  return res.status(400).json({ error: "Thumbnail file is required" });
}


if (!thumbnailFile) {
  return res.status(400).json({ error: "Thumbnail file is required" });
}

const fileBuffer = await fs.readFile(thumbnailFile.filepath);

const fileName = `products/${Date.now()}_${thumbnailFile.originalFilename?.replace(/\s+/g, '_')}`;

const { data: uploadData, error: uploadError } = await supabase.storage
  .from('products')
  .upload(fileName, fileBuffer, {
    contentType: thumbnailFile.mimetype,
    upsert: false,
  });

if (uploadError) {
  console.error("Supabase upload error:", uploadError);
  return res.status(500).json({ error: "Failed to upload image to storage" });
}

const { data: publicUrl } = supabase.storage
  .from('products')
  .getPublicUrl(fileName);

const newProduct = await addProducts(data, publicUrl.publicUrl);

            if(newProduct.success){
                return res.status(201).json({message:"created product successfully",createdProduct:newProduct.createdNewProduct})
            }else {
                return res.status(500).json({error:`${newProduct.error}`})
            }

    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}


export const deleteProduct = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
        
            const data = zodValidatorHelper(validationRemoveProduct,req.body,res);

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{products:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            const scanToCompare = itemOwner.products.map((info)=>info);

            if(!scanToCompare.some((product)=>product.id === data.id)){
                return res.status(400).json({error:"Product Id Not Found"})
            }

            const deleting = await deleteProducts(data)
            
            if (deleting.success) {
                return res.status(200).json({message:"Deleted a product successfully"})
            }else {
                return res.status(500).json({error:`${deleting.error}`})
            }

    } catch (error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }



}


export const updateProduct = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
        const { fields, files } = await parseForm(req);

            const cleanData = normalizeFormFields(fields)

            const data = zodValidatorHelper(validationUpdateProduct,cleanData,res);

               const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{products:true}})
               
               if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}
   
               const existingCategory = itemOwner.products.find(product =>product.id === data.id);
   
               if (!existingCategory) {
                   return res.status(400).json({error:"Product Id Not Found"})
               }
   
               if (itemOwner.products.some(product =>product.name === data.name && product.id !== data.id))
               {
                   return res.status(400).json({error:"Product name must be unique"})
               }
   
               if (existingCategory.name === data.name && existingCategory.description === data.description && existingCategory.categoryId === (data.categoryId) && existingCategory.price === (data.price) && existingCategory.qty === (data.qty)  ){
                   return res.status(400).json({error:"Please change either the name or description or price or quantity or category"})
               } 
   
            //    if (existingCategory.name === data.name && existingCategory.price){
                   const updateResult = await  updateProducts(data,files.thumbnail);
                   
                   if(updateResult.success){
                       return res.status(200).json({message:" Updated product successfully ",updatedProduct:updateResult.product})
                   }else{
                       return res.status(500).json({error:updateResult.error})
                   }
            //    }

            // to handle other cases 
            // return res.status(200).json({message:" Updated product successfully "})
   
       } catch (error){
           return res.status(500).json({error:`Internal Server Error:${error}`})
       }
}


export const getProduct = async (req:NextApiRequest, res:NextApiResponse) => {
        try {
                    const tokenData = await decodeToken(req.headers.authorization);
        
                    if(typeof tokenData !== "string"){
                        return res.status(401).json({message:" Invalid token ",error:tokenData.error})
                    }
                    // tokenData all include the ownerId and it being passed to function.
                    const get_products = await getProducts(tokenData);
        
                    if(get_products.success){
                        return res.status(200).json({message:" Fetched all products successfully ",products:get_products.products})
                    } else {
                        return res.status(500).json({error:get_products.error})
                    }
        
            } catch (error) {
                return res.status(500).json({error:`Internal Server Error:${error}`})
            }

}