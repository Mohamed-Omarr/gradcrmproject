import { NextApiRequest , NextApiResponse } from "next";
import { updatingCustomerName } from "../../../../controllers/shop/profile/mangeCustomerInfoController";

export default async function updateAdminName(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "PATCH") {
        return await updatingCustomerName(req,res)
    }
    return res.status(405).json({error:"Method Not Allowed"});
}