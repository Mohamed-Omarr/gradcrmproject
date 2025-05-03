import { NextApiRequest , NextApiResponse } from "next";
import { createColor, deleteColor, getColor, updateColor } from "../../../../../controllers/crm/product/attributes/colorsController";


export default async function  colorsHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createColor(req,res)  
    }

    if (req.method === "DELETE") {
        return await deleteColor(req,res)  
    }

    if (req.method === "PATCH") {
        return await updateColor(req,res)  
    }


    if (req.method === "GET") {
        return await getColor(req,res)  
    }
}