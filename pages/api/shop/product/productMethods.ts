import { NextApiRequest , NextApiResponse } from "next";
import { getProduct } from "../../../../controllers/shop/product/productController";


export default async function  productHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "GET") {
        await getProduct(res)
    }
    
    return res.status(405).json({message:"Method Not Allowed"})
}