import "dotenv/config"
import {  NextApiResponse } from "next"
import jwt from "jsonwebtoken";
import { getAdminInfo } from "../../models/crm/auth/getAdminInfo";

export const verifyToken = async (res:NextApiResponse,token:string) => {
    try {
        if (!process.env.REFRESH_TOKEN_KEY) {
            throw new Error ("Missing Secret JWT");
        }
        
        const verifiedToken = jwt.verify(token,process.env.REFRESH_TOKEN_KEY) as {id:string};

        const user = await getAdminInfo(verifiedToken.id);
        
        if (!user.success) {
            return res.status(404).json({error:`User not found ${user.error}`})
        }
        return res.status(200).json({ message: "User info retrieved", user:user.data });
    } catch(error){
        return res.status(400).json({error:`processing failed verifying token: ${error}`})
    }
}