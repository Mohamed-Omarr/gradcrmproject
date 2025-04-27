import { NextApiRequest , NextApiResponse } from "next";
import { loginUser } from "../../../../controllers/crm/auth/authController";

export default async function handleLogin(req:NextApiRequest , res:NextApiResponse) {
    
    if (req.method === "POST") {
        return await loginUser(req,res)
    }
    return res.status(405).json({error:"Method Not Allowed"});
}