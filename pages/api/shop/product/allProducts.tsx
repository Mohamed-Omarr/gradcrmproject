import { NextApiRequest , NextApiResponse } from "next";
import { getProduct } from "../../../../controllers/shop/product/productController";


export default async function allProductsHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "GET") {
        return await getProduct(res)
    }
    
    return res.status(405).json({message:"Method Not Allowed"})
}