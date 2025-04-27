import { NextApiRequest , NextApiResponse } from "next";
import { info_of_customer } from "../../../../controllers/shop/auth/CustomerAuthController";
export default async function handleGetCustomerInfo(req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "GET") {
        return await info_of_customer(req,res);
    }
    
    return res.status(405).json({error:"Method Not Allowed"});
}