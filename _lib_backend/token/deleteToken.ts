import { setCookie } from "nookies";
import "dotenv/config"
import { NextApiResponse } from "next";

export const deleteToken = async (res:NextApiResponse) => {
    try {
        // save token in cookies - in future must change  secure to  secure:true
        setCookie({res},'crm_token','',{
            httpOnly:true,
            secure: false, //only for production 
            maxAge: -1,
            path:'/crm',
            sameSite: "Lax",
        })
        setCookie({res},'crm_refresh','',{
            httpOnly:true,
            secure: false, //only for production 
            maxAge: -1,
            path:'/api/crm',
            sameSite: "Lax",
        })

        return res.status(200).json({message: "Logout Successfully"})
    }catch(error) {
        return res.status(400).json({error:`Failed to logout successfully:${error}`})
    }
}