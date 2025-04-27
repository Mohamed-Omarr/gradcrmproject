import { NextApiRequest , NextApiResponse } from "next";
import { addProducts, deleteProducts, getProducts, updateProducts } from "../../../models/crm/product/productModels";
import { ZodError } from "zod";
import { validationCreateProduct, validationRemoveProduct, validationUpdateProduct } from "../../../_lib_backend/validation/productValidation";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { formatZodError } from "../../../_lib_backend/validation/zodError";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";

export const createProduct = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        const data:Product =  req.body;
        try {
            // parse the incoming data
            validationCreateProduct.parse( data);

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{products:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            const scanToCompare = itemOwner.products.map((info)=>info);

            if(scanToCompare.length > 0 && scanToCompare.some((product)=>product.name === data.name)){
                return res.status(400).json({error:"Not allowed to duplicate name"})
            }
            
            if(scanToCompare.length > 0 && !scanToCompare.some((product)=>product.categoryId)){
                return res.status(400).json({error:"Failed the selected category Id Not Found"})
            }

            const newProduct = await addProducts(data);

            if(newProduct.success){
                return res.status(201).json({message:"created product successfully",createdProduct:newProduct.createdNewProduct})
            }else {
                return res.status(500).json({error:`${newProduct.error}`})
            }

        } catch (error) {
            
            if (error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        }

    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}


export const deleteProduct = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
        const data:removeProduct = req.body;

        try {

            validationRemoveProduct.parse(data)

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{products:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            const scanToCompare = itemOwner.products.map((info)=>info);

            if(!scanToCompare.some((product)=>product.id === Number.parseInt(data.id))){
                return res.status(400).json({error:"Product Id Not Found"})
            }

            const deleting = await deleteProducts(data)
            
            if (deleting.success) {
                return res.status(200).json({message:"Deleted a product successfully "})
            }else {
                return res.status(500).json({error:`${deleting.error}`})
            }

        }catch(error){
            if(error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        }


    } catch (error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }



}


export const updateProduct = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
           const data:Product = req.body;
   
           try {
   
            validationUpdateProduct.parse(data)
   
               const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{products:true}})
               
               if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}
   
               const existingCategory = itemOwner.products.find(product =>product.id === Number.parseInt(data.id));
   
               if (!existingCategory) {
                   return res.status(400).json({error:"Product Id Not Found"})
               }
   
               if (itemOwner.products.some(product =>product.name === data.name && product.id !== Number.parseInt(data.id)))
               {
                   return res.status(400).json({error:"Product name must be unique"})
               }
   
               if (existingCategory.name === data.name && existingCategory.description === data.description && existingCategory.categoryId === Number.parseInt(data.categoryId) && existingCategory.price === Number.parseInt(data.price) && existingCategory.qty === Number.parseInt(data.qty)  ){
                   return res.status(400).json({error:"Please change either the name or description or price or quantity or category"})
               } 
   
               if (existingCategory.name === data.name && existingCategory.price){
                   const updateResult = await  updateProducts(data);;
                   
                   if(updateResult.success){
                       return res.status(200).json({message:" Updated product successfully ",updatedProduct:updateResult.product})
                   }else{
                       return res.status(500).json({error:updateResult.error})
                   }
               }
               // to handle other cases 
   
               return res.status(200).json({message:" Updated product successfully "})
   
           }catch(error){
               if(error instanceof ZodError) {
                   return res.status(400).json({error:formatZodError(error)})
               }
               return res.status(400).json({error:`validation Failed: ${error}`})
           }
   
   
       } catch (error){
           return res.status(500).json({error:`Internal Server Error:${error}`})
       }



}



export const getProduct = async (req:NextApiRequest, res:NextApiResponse) => {
        try {
                    const tokenData = await decodeToken(req.headers.authorization);
        
                    if(typeof tokenData !== "string"){
                        return res.status(201).json({message:" Invalid token ",error:tokenData.error})
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