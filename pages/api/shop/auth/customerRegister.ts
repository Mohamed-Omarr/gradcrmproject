import { NextApiRequest , NextApiResponse } from "next";
import { customer_register } from "../../../../controllers/shop/auth/CustomerAuthController";
export default async function handleRegister(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await customer_register(req,res);
    }
    return res.status(405).json({error:"Method Not Allowed"});
}