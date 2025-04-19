import { NextApiRequest , NextApiResponse } from "next";
import { updatingPassword } from "../../../../controllers/crm/profile/mangeUserInfoController";

export default async function updatePassword(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }

    await updatingPassword(req,res)
}