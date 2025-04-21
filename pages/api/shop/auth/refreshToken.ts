import { NextApiRequest , NextApiResponse } from "next";
import { refreshingToken } from "../../../../_lib_backend/token/refreshingToken";

export default async function handleRefreshToken(req:NextApiRequest , res:NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error:"Method Not Allowed"});
    }
    
    await refreshingToken(req,res);
}