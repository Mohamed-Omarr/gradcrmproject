import { NextApiRequest , NextApiResponse } from "next";
import { updatingPassword } from "../../../../controllers/crm/profile/mangeAdminInfoController";

export default async function updatePassword(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return  await updatingPassword(req,res)
    }
    
    return res.status(405).json({error:"Method Not Allowed"});
}