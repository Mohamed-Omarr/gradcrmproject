import { setCookie } from "nookies";
import jwt from "jsonwebtoken";
import "dotenv/config"
import { NextApiResponse } from "next";
import prisma from "../prismaClient/PrismaClient";
type userData = {
    id: string;
    role: string;
    name:string,
    email:string,
}

export const generateToken = async (user:userData,res:NextApiResponse) => {
    try {
        
        // secure the jwt secret
        if (!process.env.ACCESS_TOKEN_KEY || !process.env.REFRESH_TOKEN_KEY) {
            throw new Error ("missing the jwt secret variable")
        }

        const access_token_key  = process.env.ACCESS_TOKEN_KEY; // Keep this secure

        const refresh_token_key = process.env.REFRESH_TOKEN_KEY; // Keep this secure

        const payload = {
            id: user.id,
            name:user.name,
            role:user.role,
            email:user.email,
        };

        const accessToken = jwt.sign(payload, access_token_key, { expiresIn: "15m" });

        const refreshToken = jwt.sign(payload, refresh_token_key, { expiresIn: "7d" });
        
        if (user.role === "ADMIN"){
            // save token in cookies - in future must change  secure to  secure:true
            setCookie({res},'crm_token',refreshToken,{
                httpOnly:true,
                secure: false, //only for production 
                maxAge: 60 * 60 * 24 * 7,
                path:'/',
                sameSite: "Lax",
            })
            await prisma.admin.update({
                where:{
                    id:payload.id
                },
                data:{
                    refreshToken,
                }
            })
        }else{

            // save token in cookies - in future must change  secure to  secure:true
            setCookie({res},'shop_token',refreshToken,{
                httpOnly:true,
                secure: false, //only for production 
                maxAge: 60 * 60 * 24 * 7,
                path:'/',
                sameSite: "Lax",
            })
            
            await prisma.customer.update({
                where:{
                    id:payload.id
                },
                data:{
                    refreshToken,
                }
            })
        }
        return {success:true,accessToken}        
    }catch(err) {
        return {success:false,error:err}
    }
}