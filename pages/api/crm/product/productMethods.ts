import { NextApiRequest , NextApiResponse } from "next";
import {  deleteProduct, getProduct } from "../../../../controllers/crm/product/productController";
  
export default async function  productHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "DELETE") {
        return await deleteProduct(req,res)  
    }

    if (req.method === "GET") {
        return await getProduct(req,res)  
    }
    return res.status(405).json({error:"Method Not Allowed"});

}