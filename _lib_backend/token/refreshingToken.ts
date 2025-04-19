"use server"
import jwt from "jsonwebtoken";
import "dotenv/config"
import { NextApiRequest , NextApiResponse } from "next";
import { parseCookies, setCookie } from 'nookies';
import prisma from "../prismaClient/PrismaClient";

export const refreshingToken = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        const cookies = parseCookies({req});
        
        const incomingRefreshToken = cookies.crm_refresh;
        
        if (!incomingRefreshToken) {
            return res.status(401).json({ message: 'No refresh token' }); 
        }

          // secure the jwt secret
        if (!process.env.ACCESS_TOKEN_KEY || !process.env.REFRESH_TOKEN_KEY) {
            throw new Error ("missing the jwt secret variable")
        }

        const refresh_token_key = process.env.REFRESH_TOKEN_KEY; // Keep this secure
        const access_token_key  = process.env.ACCESS_TOKEN_KEY; // Keep this secure

        let decoded;

        try{
            decoded = jwt.verify(incomingRefreshToken,refresh_token_key) as {id:string};
        }catch(err){
                    setCookie({res},'crm_refresh',refresh_token_key,{
                        httpOnly: true,
                        secure: false,
                        expires: new Date(0),
                        path: '/api/crm',
                        sameSite: "lax",
                    })
            decoded = jwt.decode(incomingRefreshToken) as {id:string};
            await prisma.admin.update({
                where:{id:decoded.id},
                data:{refreshToken:null}
            }).then(()=>console.log("removed from database")
            ).catch((e) =>console.error(e,"vialed to remove from database"))
            return res.status(401).json({ message: `Invalid refresh token`,error:err });
        }

        const user = await prisma.admin.findFirst({
            where:{id:decoded.id},
            select:{id:true,refreshToken:true}
        });

        if (!user || user.refreshToken !== incomingRefreshToken) {
            await prisma.admin.update({
                where:{id:decoded.id},
                data:{refreshToken:null}
            })

            return res.status(403).json({ message: 'Refresh token reuse detected. Logged out.' });
        }

        const newAccessToken = jwt.sign({id:user.id}, access_token_key, { expiresIn: "30s" });

        return res.status(200).json({ accessToken: newAccessToken });

    }catch(error) {
        return res.status(400).json({error:`Failed to refresh token:${error}`})
    }
}