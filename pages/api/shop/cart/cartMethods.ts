import { NextApiRequest , NextApiResponse } from "next";
import { getCart } from "../../../../controllers/shop/cart/cartController";

export default async function  cartHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "GET") {
        return await getCart(res,req)  
    }
    return res.status(405).json({message:"Method Not Allowed"})
}