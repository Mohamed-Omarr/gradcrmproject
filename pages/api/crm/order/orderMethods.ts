import { NextApiRequest , NextApiResponse } from "next";
import { getOrder, updateOrderStatus } from "../../../../controllers/crm/order/orderController";


export default async function  stockHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "PATCH") {
        return await updateOrderStatus(req,res)  
    }

    if (req.method === "GET") {
        return await getOrder(req,res)  
    }
    return res.status(405).json({error:"Method Not Allowed"});
}