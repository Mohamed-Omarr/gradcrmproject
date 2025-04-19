import { NextApiRequest , NextApiResponse } from "next";
import { info_of_user } from "../../../../controllers/crm/auth/authController";
export default async function handleGetUserInfo(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    
    await info_of_user(req,res);
}