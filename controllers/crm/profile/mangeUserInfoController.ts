import { NextApiRequest , NextApiResponse } from "next";
import { changingName } from "../../../models/crm/profile/changingName";
import { changingEmail } from "../../../models/crm/profile/changingEmail";
import { changingPassword } from "../../../models/crm/profile/changingPassword";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { validationUpdateEmail, validationUpdatePassword, validationUpdateUsername } from "../../../_lib_backend/validation/updatingUserInfoValidation";
import { formatZodError } from "../../../_lib_backend/validation/zodError";


export const updatingAdminName = async (req:NextApiRequest,res:NextApiResponse) => {
    try{
        const data:update_name = req.body;
        try {
            
            validationUpdateUsername.parse(data)
            const scanId = await prisma.admin.findUnique({where:{id:data.id,name:data.previousName}});

            if (!scanId) {
                return res.status(400).json({error:"User Not Found"})
            }
            
            if (!data.newName || data.newName.trim() === " "){
                return res.status(400).json({error:`Failed Updating Name : Name can not be empty `}) 
            }

            await changingName(data);

            return res.status(200).json({message:"Updated Successfully"});

        } catch(error){
            if (error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        }

    
    }catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}

export const updatingEmail = async (req:NextApiRequest,res:NextApiResponse) => {
    try{
        const data:update_email = req.body;
        try {
            validationUpdateEmail.parse(data)

            const scanId = await prisma.admin.findUnique({where:{id:data.id,email:data.previousEmail}});

        if (!scanId) {
            return res.status(400).json({error:"User Not Found"})
        }

        const isMatch = await bcrypt.compare(data.password,scanId.password);
                    
        if(!isMatch) return res.status(401).json({error:"Invalid Password"});

        await changingEmail(data);

        return res.status(200).json({message:"Updated Successfully"});

        }catch(error){
            if (error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        }

    }catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}

export const updatingPassword = async (req:NextApiRequest,res:NextApiResponse) => {
    try{
        const data:update_password = req.body;
        try{
            validationUpdatePassword.parse(data)
            const scanId = await prisma.admin.findUnique({where:{id:data.id,email:data.email}});
            if (!scanId) {
                return res.status(400).json({error:"User Not Found"})
            }

            
            if (data.confirmNewPassword !== data.newPassword) {
                return res.status(400).json({error:"current password mut match confirm password"})
            }


            const isMatch = await bcrypt.compare(data.currentPassword,scanId.password);
            
            if(!isMatch) return res.status(401).json({error:"Invalid Password"});

            // const comparingPassword = await bcrypt.compare(data.newPassword,scanId.password);

            // if (comparingPassword) {
            //     return res.status(400).json({error:"new password same as old password"})
            // }

            const hashedPassword = await bcrypt.hash(data.newPassword,10)
            
            await changingPassword(data,hashedPassword);

            return res.status(200).json({message:"Updated Successfully"});
        }catch(error){
            if (error instanceof ZodError) {
                return res.status(400).json({error:formatZodError(error)})
            }
            return res.status(400).json({error:`validation Failed: ${error}`})
        }
        
    }catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}