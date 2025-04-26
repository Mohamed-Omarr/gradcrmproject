import { NextApiRequest , NextApiResponse } from "next";
import { crmRefreshingToken  } from "../../../../_lib_backend/token/crmRefreshingToken";

export default async function handleRefreshToken(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    
    await crmRefreshingToken(req,res);
}