import { NextApiRequest , NextApiResponse } from "next";
import { customer_login } from "../../../../controllers/shop/auth/authControllerCustomer";

export default async function handleLogin(req:NextApiRequest , res:NextApiResponse) {
    
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    await customer_login(req,res)
}