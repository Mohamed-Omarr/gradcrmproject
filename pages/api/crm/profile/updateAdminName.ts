import { NextApiRequest , NextApiResponse } from "next";
import { updatingAdminName } from "../../../../controllers/crm/profile/mangeAdminInfoController";

export default async function updateAdminName(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await updatingAdminName(req,res)
    }
    return res.status(405).json({error:"Method Not Allowed"});
}