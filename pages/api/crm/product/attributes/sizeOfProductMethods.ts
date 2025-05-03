import { NextApiRequest , NextApiResponse } from "next";
import { createSizeOfProduct, updateSizeOfProduct } from "../../../../../controllers/crm/product/attributes/sizesController";


export default async function  sizeHandler (req:NextApiRequest , res:NextApiResponse) {
        if (req.method === "POST") {
            return await createSizeOfProduct(req,res)  
        }

        if (req.method === "PATCH") {
            return await updateSizeOfProduct(req,res)
        }
}