import { NextApiRequest , NextApiResponse } from "next";
import { createOrder, getOrder } from "../../../../../controllers/shop/payment/order/orderController";

export default async function  cardHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createOrder(res,req)  
    }

    if (req.method === "GET") {
        return await getOrder(res,req)  
    }

    return res.status(405).json({message:"Method Not Allowed"})
}