import { NextApiRequest , NextApiResponse } from "next";
import { customer_login } from "../../../../controllers/shop/auth/CustomerAuthController";

export default async function handleLogin(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await customer_login(req,res)
    }
    return res.status(405).json({error:"Method Not Allowed"});
}