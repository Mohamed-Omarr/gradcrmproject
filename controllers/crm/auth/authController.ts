import { NextApiRequest , NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { userLogin } from "../../../models/crm/auth/userLogin";
import { ZodError } from "zod";
import { createAdmin } from "../../../models/crm/auth/createAdmin";
import { ValidateUserLogin, ValidateUserRegister } from "../../../_lib_backend/validation/authValidation";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { formatZodError } from "../../../_lib_backend/validation/zodError";
import { generateToken } from "../../../_lib_backend/token/generateToken";
import { verifyToken } from "../../../_lib_backend/token/verifyToken";
import { userLogout } from "../../../models/crm/auth/userLogout";
import { deleteToken } from "../../../_lib_backend/token/deleteToken";

export const registerUser = async (req:NextApiRequest , res:NextApiResponse) => {
    try {
        const data = req.body;
        try { 
            // parse will throw an error 
            ValidateUserRegister.parse(data);

            const hashedPassword = await bcrypt.hash(data.password,10);

            const user = {data,hashedPassword}

            // make sure email is not exits
            const scan = await prisma.register.findUnique({where:{email: user.data.email}})

            if (scan) {return res.status(400).json({error:`Email exits`})}

            await createAdmin(user)

            return res.status(201).json({message:"User register successfully"})

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        } 

    } catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}



export const loginUser = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
        const data = req.body;
        try {
             // parse will throw an error 
            ValidateUserLogin.parse(data);
            
            const user = await prisma.admin.findUnique({where:{email:data.email}})

            if (!user) return res.status(404).json({error:"Email not exits"});

            const isMatch = await bcrypt.compare(data.password,user.password);
            
            if(!isMatch) return res.status(401).json({error:"Invalid credentials"});

            //  await prisma model
            await userLogin(user.id,user.role);

            // await generate the token
            await generateToken(user,res);

        } catch(error){
            if (error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        }

    } catch(error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

export const logoutUser = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
        const data:logout = req.body;
            
            const user = await prisma.admin.findUnique({where:{id:data.userId}})

            if (!user) return res.status(404).json({error:"User not found"});
            
            //  await prisma model
            const user_logging_out = await userLogout(user.id,user.role);

            if(user_logging_out.success){
                await deleteToken(res);
            }else{
                return res.status(400).json({error:`Failed logging out: ${user_logging_out.error}`})
            }

    } catch(error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}


export const info_of_user = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json("Not Authorized User");
        }
        await verifyToken(res,token)
    } catch(error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

