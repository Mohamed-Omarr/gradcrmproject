import { NextApiRequest , NextApiResponse } from "next";
import { shopRefreshingToken } from "../../../../_lib_backend/token/shopRefreshingToken";

export default async function handleRefreshToken(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    
    await shopRefreshingToken(req,res);
}