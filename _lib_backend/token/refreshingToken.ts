"use server"
import jwt from "jsonwebtoken";
import "dotenv/config"
import { NextApiRequest , NextApiResponse } from "next";
import { parseCookies } from 'nookies';
import prisma from "../prismaClient/PrismaClient";

export const refreshingToken = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        const cookies = parseCookies({req});

        const incomingRefreshToken = cookies.crm_token;
        
        if (!incomingRefreshToken) {
            return res.status(401).json({ message: 'No refresh token' }); 
        }

          // secure the jwt secret
        if (!process.env.ACCESS_TOKEN_KEY || !process.env.REFRESH_TOKEN_KEY) {
            throw new Error ("missing the jwt secret variable")
        }

        const refresh_token_key = process.env.REFRESH_TOKEN_KEY; // Keep this secure
        const access_token_key  = process.env.ACCESS_TOKEN_KEY; // Keep this secure

        const decoded = jwt.verify(incomingRefreshToken,refresh_token_key) as {id:string};

        const user = await prisma.admin.findFirst({
            where:{id:decoded.id},
            select:{id:true,refreshToken:true}
        });

        if (!user || user.refreshToken !== incomingRefreshToken) {
            await prisma.admin.update({
                where:{id:decoded.id},
                data:{refreshToken:null}
            })
            return res.status(401).json({ message: 'Refresh token reuse detected. Logged out.' });
        }

        const newAccessToken = jwt.sign({id:user.id}, access_token_key, { expiresIn: "1s" });

        return res.status(200).json({ accessToken: newAccessToken });

    }catch(error) {
        return res.status(401).json({error:`Failed to refresh token:${error}`})
    }
}