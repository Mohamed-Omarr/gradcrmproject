import { NextApiRequest , NextApiResponse } from "next";
import { getCategory } from "../../../../controllers/shop/category/categoryController";

export default async function  categoryHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "GET") {
        return await getCategory(res)  
    }

    return res.status(405).json({message:"Method Not Allowed"})
}