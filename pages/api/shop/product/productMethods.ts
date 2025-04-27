import { NextApiRequest , NextApiResponse } from "next";
import { getProduct, getProductById } from "../../../../controllers/shop/product/productController";


export default async function  productHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.itemId){
            return await getProductById(res,req.query.itemId as string)
            
        }else{
            return await getProduct(res)
        }
    }
    
    return res.status(405).json({message:"Method Not Allowed"})
}