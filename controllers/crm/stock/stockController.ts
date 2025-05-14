import { NextApiRequest , NextApiResponse } from "next";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import { validationCreateStock, validationRemoveStock, validationUpdateStock } from "../../../_lib_backend/validation/stockValidation";
import { addStocks, deleteStocks, getStocks, updateStocks } from "../../../models/crm/stock/stockModels";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";

export const createStock = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
            // parse the incoming data
            const data = zodValidatorHelper(validationCreateStock,req.body,res)

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{stocks:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}


            if(itemOwner.stocks.length > 0 && itemOwner.stocks.some((stockId)=>stockId.name === data.name)){
                return res.status(400).json({error:"Not allowed to duplicate name"})
            } 

            const newStock = await addStocks(data);

            if(newStock.success){
                return res.status(201).json({message:"created stock successfully",createdStock:newStock.createdNewStock})
            }else {
                return res.status(500).json({error:`${newStock.error}`})
            }


    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}


export const deleteStock = async (req:NextApiRequest, res:NextApiResponse) => {
    try {

            const data = zodValidatorHelper(validationRemoveStock,req.body,res)

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{stocks:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}


            if(itemOwner.stocks.length > 0 && !itemOwner.stocks.some((stockId)=>stockId.id === data.id)){
                {return res.status(400).json({error:"Process of delete can not be complete because the stock not exits "})}
            }

            const deleting = await deleteStocks(data)

            if (deleting.success) {
                return res.status(200).json({message:"Deleted a stock successfully ",unselectedCategory:deleting.unselectedCategory})
            }else {
                return res.status(500).json({error:`${deleting.error}`})
            }


    } catch (error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }



}


export const updateStock= async (req:NextApiRequest, res:NextApiResponse) => {
    try {

            const data = zodValidatorHelper(validationUpdateStock,req.body,res)

            const itemOwner = await prisma.admin.findUnique({where:{id:data.ownerId},select:{stocks:true}})
            
            if(!itemOwner) {return res.status(400).json({error:"Owner Id Not Found"})}

            const existingCategory = itemOwner.stocks.find(stock =>stock.id === data.id);

            if (!existingCategory) {
                return res.status(400).json({error:"Stock Id Not Found"})
            }

            if (itemOwner.stocks.some(stock =>stock.name === data.name && stock.id !== data.id))
            {
                return res.status(400).json({error:"Stock name must be unique"})
            }

            if (itemOwner.stocks.some(stock =>stock.categoryId ===  (data.categoryId) && stock.id !== (data.id))){
                return res.status(400).json({error:"Category of each stock must be unique "})
            } 

            if (existingCategory.name === data.name && existingCategory.description === data.description && existingCategory.categoryId === data.categoryId){
                return res.status(400).json({error:"Please change either the name or description or category"})
            } 

            if (existingCategory.name === data.name  && existingCategory.categoryId === data.categoryId) {
                const updateResult = await  updateStocks(data);
                
                if(updateResult.success){
                    return res.status(200).json({message:" Updated stock successfully ",updatedStock:updateResult.stock})
                }else{
                    return res.status(500).json({error:updateResult.error})
                }
            }else {
                // to handle other cases 
                const updateResultOtherCases = await  updateStocks(data);;
                
                if(updateResultOtherCases.success){
                    return res.status(200).json({message:" Updated stock successfully ",updatedStock:updateResultOtherCases.stock,updatedCategory:updateResultOtherCases.categories})
                }else{
                    return res.status(500).json({error:updateResultOtherCases.error})
                }
            }

    } catch (error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }



}



export const getStock = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
            const tokenData = await decodeToken(req.headers.authorization);

            if(typeof tokenData !== "string"){
                return res.status(401).json({message:" Invalid token ",error:tokenData.error})
            }
            // tokenData all include the ownerId and it being passed to function.
            const get_stocks = await getStocks(tokenData);

            if(get_stocks.success){
                return res.status(200).json({message:" Fetched all stocks successfully ",stocks:get_stocks.stocks})
            } else {
                return res.status(500).json({error:get_stocks.error})
            }

    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}