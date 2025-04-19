import { NextApiRequest , NextApiResponse } from "next";
import { createStock, deleteStock, getStock, updateStock } from "../../../../controllers/crm/stock/stockController";


export default async function  stockHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        await createStock(req,res)  
    }

    if (req.method === "DELETE") {
        await deleteStock(req,res)  
    }

    if (req.method === "PATCH") {
        await updateStock(req,res)  
    }


    if (req.method === "GET") {
        await getStock(req,res)  
    }
}