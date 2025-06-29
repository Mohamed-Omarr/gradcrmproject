import { NextApiRequest , NextApiResponse } from "next";
import {  deleteStock, } from "../../../../controllers/crm/stock/stockController";
import { getCustomer } from "../../../../controllers/crm/customer/customerController";


export default async function  stockHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "DELETE") {
        return await deleteStock(req,res)  
    }

    if (req.method === "GET") {
        return await getCustomer(req,res)  
    }
    return res.status(405).json({error:"Method Not Allowed"});
}