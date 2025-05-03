import { NextApiRequest , NextApiResponse } from "next";
import { createSize, deleteSize, getSize, updateSize } from "../../../../../controllers/crm/product/attributes/sizesController";


export default async function  sizesHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createSize(req,res)  
    }

    if (req.method === "DELETE") {
        return await deleteSize(req,res)  
    }

    if (req.method === "PATCH") {
        return await updateSize(req,res)  
    }


    if (req.method === "GET") {
        return await getSize(res)  
    }
}