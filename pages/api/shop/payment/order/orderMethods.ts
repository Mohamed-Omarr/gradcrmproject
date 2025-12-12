import { NextApiRequest , NextApiResponse } from "next";
import { createOrder, getOrder } from "../../../../../controllers/shop/payment/order/orderController";

export default async function  cardHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createOrder(req,res)  
    }

    if (req.method === "GET") {
        return await getOrder(req,res)  
    }

    return res.status(405).json({message:"Method Not Allowed"})
}