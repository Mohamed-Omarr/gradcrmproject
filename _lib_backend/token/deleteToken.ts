import { setCookie } from "nookies";
import "dotenv/config"
import { NextApiResponse } from "next";

export const deleteToken = async (res:NextApiResponse,userType:string) => {
    if(userType === "ADMIN"){
        // save token in cookies - in future must change  secure to  secure:true
        setCookie({res},'crm_token','',{
            httpOnly:true,
            secure: false, //only for production 
            maxAge: -1,
            path:'/',
            sameSite: "Lax",
        })
    }else{
         // save token in cookies - in future must change  secure to  secure:true
        setCookie({res},'shop_token','',{
            httpOnly:true,
            secure: false, //only for production 
            maxAge: -1,
            path:'/',
            sameSite: "Lax",
        })
    }
}