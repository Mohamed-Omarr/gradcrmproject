import { NextApiRequest , NextApiResponse } from "next";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../../../../controllers/crm/category/categoryController";


export default async function  categoryHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        await createCategory(req,res)  
    }

    if (req.method === "DELETE") {
        await deleteCategory(req,res)  
    }

    if (req.method === "PATCH") {
        await updateCategory(req,res)  
    }


    if (req.method === "GET") {
        await getCategory(req,res)  
    }
}