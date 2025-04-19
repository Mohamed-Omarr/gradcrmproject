import { NextApiRequest , NextApiResponse } from "next";
import {  logoutUser } from "../../../../controllers/crm/auth/authController";

export default async function handleLogout(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    await logoutUser(req,res)
}