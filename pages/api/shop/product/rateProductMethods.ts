import { NextApiRequest , NextApiResponse } from "next";
import { createRateForProduct, deleteRateOfProduct, updateRateOfProduct } from "../../../../controllers/shop/product/rateController";


export default async function  rateHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return createRateForProduct(req,res)
    }

    if (req.method === "PATCH") {
        return updateRateOfProduct(req,res)
    }

    if (req.method === "DELETE") {
        return deleteRateOfProduct(req,res)
    }
    
    if (req.method === "GET") {
        return deleteRateOfProduct(req,res)
    }
    
}