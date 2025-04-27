import { NextApiRequest , NextApiResponse } from "next";
import { updatingEmail } from "../../../../controllers/crm/profile/mangeUserInfoController";

export default async function updateEmail(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await updatingEmail(req,res)
    }
    
    return res.status(405).json({error:"Method Not Allowed"});
}