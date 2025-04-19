import { NextApiRequest , NextApiResponse } from "next";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../../../../controllers/crm/product/productController";


export default async function  productHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        await createProduct(req,res)  
    }

    if (req.method === "DELETE") {
        await deleteProduct(req,res)  
    }

    if (req.method === "PATCH") {
        await updateProduct(req,res)  
    }


    if (req.method === "GET") {
        await getProduct(req,res)  
    }
}