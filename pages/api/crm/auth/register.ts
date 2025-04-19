import { NextApiRequest , NextApiResponse } from "next";
import { registerUser } from "../../../../controllers/crm/auth/authController";
export default async function handleRegister(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    await registerUser(req,res);
}