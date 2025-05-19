import { NextApiRequest , NextApiResponse } from "next";
import { addToCart, deleteFromCart } from "../../../../controllers/shop/cart/cartItemsController";

export default async function  cartItemHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await addToCart(res,req)  
    }

    if (req.method === "DELETE") {
        return await deleteFromCart(res,req)  
    }

    return res.status(405).json({message:"Method Not Allowed"})
}