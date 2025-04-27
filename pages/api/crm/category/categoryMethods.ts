import { NextApiRequest , NextApiResponse } from "next";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../../../../controllers/crm/category/categoryController";


export default async function  categoryHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createCategory(req,res)  
    }

    if (req.method === "DELETE") {
        return await deleteCategory(req,res)  
    }

    if (req.method === "PATCH") {
        return await updateCategory(req,res)  
    }


    if (req.method === "GET") {
        return await getCategory(req,res)  
    }
}