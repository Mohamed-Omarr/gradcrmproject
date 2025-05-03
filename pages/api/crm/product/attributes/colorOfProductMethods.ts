import { NextApiRequest , NextApiResponse } from "next";
import { createColorOfProduct, updateColorOfProduct } from "../../../../../controllers/crm/product/attributes/colorsController";


export default async function  colorHandler (req:NextApiRequest , res:NextApiResponse) {
        if (req.method === "POST") {
            return await createColorOfProduct(req,res)  
        }

        if (req.method === "PATCH") {
            return await updateColorOfProduct(req,res)
        }
}