import { NextApiRequest , NextApiResponse } from "next";
import { updatingCustomerEmail } from "../../../../controllers/shop/profile/mangeCustomerInfoController";

export default async function updateEmail(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "PATCH") {
        return await updatingCustomerEmail(req,res)
    }
    
    return res.status(405).json({error:"Method Not Allowed"});
}