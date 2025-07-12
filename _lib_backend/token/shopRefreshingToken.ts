"use server"
import jwt from "jsonwebtoken";
import "dotenv/config"
import { NextApiRequest , NextApiResponse } from "next";
import { parseCookies } from 'nookies';
import prisma from "../prismaClient/PrismaClient";

export const shopRefreshingToken = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        const cookies = parseCookies({req});

        const incomingRefreshToken = cookies.shop_token;
        
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

        const user = await prisma.customer.findFirst({
            where:{id:decoded.id},
            select:{id:true,refreshToken:true}
        });

        if (!user || user.refreshToken !== incomingRefreshToken) {
            await prisma.customer.update({
                where:{id:decoded.id},
                data:{refreshToken:null}
            })
            return res.status(401).json({ message: 'Refresh token reuse detected. Logged out.' });
        }

        const newAccessToken = jwt.sign({id:user.id}, access_token_key, { expiresIn: "15m" });

        return res.status(200).json({ AccessToken: newAccessToken });

    }catch(error) {
        return res.status(401).json({error:`Failed to refresh token:${error}`})
    }
}