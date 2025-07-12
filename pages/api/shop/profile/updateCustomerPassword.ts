import { NextApiRequest , NextApiResponse } from "next";
import { updatingCustomerPassword } from "../../../../controllers/shop/profile/mangeCustomerInfoController";

export default async function updatePassword(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return  await updatingCustomerPassword(req,res)
    }
    
    return res.status(405).json({error:"Method Not Allowed"});
}