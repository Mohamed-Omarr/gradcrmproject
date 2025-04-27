import { NextApiRequest , NextApiResponse } from "next";
import { createStock, deleteStock, getStock, updateStock } from "../../../../controllers/crm/stock/stockController";


export default async function  stockHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createStock(req,res)  
    }

    if (req.method === "DELETE") {
        return await deleteStock(req,res)  
    }

    if (req.method === "PATCH") {
        return await updateStock(req,res)  
    }


    if (req.method === "GET") {
        return await getStock(req,res)  
    }
}