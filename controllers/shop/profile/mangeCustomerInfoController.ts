import { NextApiRequest , NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { validationUpdateEmail, validationUpdatePassword, validationUpdateUsername } from "../../../_lib_backend/validation/updatingUserInfoValidation";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { customerChangingName } from "../../../models/shop/profile/customerChangingName";
import { customerChangingEmail } from "../../../models/shop/profile/customerChangingEmail";
import { customerChangingPassword } from "../../../models/shop/profile/customerChangingPassword";

export const updatingCustomerName = async (req:NextApiRequest,res:NextApiResponse) => {
    try{
            
            const data = zodValidatorHelper(validationUpdateUsername,req.body,res);

            const scanId = await prisma.customer.findUnique({where:{id:data.id}});

            if (!scanId) {
                return res.status(400).json({error:"User Not Found"})
            }
            
            if (!data.newName || data.newName.trim() === " "){
                return res.status(400).json({error:`Failed Updating Name : Name can not be empty `}) 
            }

            const resultChaning = await customerChangingName(data);

            if (resultChaning.success) {
                return res.status(200).json({message:"Updated Successfully"});
            } else {
                return res.status(500).json({message:"Failed Updating Name",error:resultChaning.error});
            }

    
    }catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}

export const updatingCustomerEmail = async (req:NextApiRequest,res:NextApiResponse) => {
    try{
            const data = zodValidatorHelper(validationUpdateEmail,req.body,res);

            const scanId = await prisma.customer.findUnique({where:{id:data.id}});

        if (!scanId) {
            return res.status(400).json({error:"User Not Found"})
        }

        const isMatch = await bcrypt.compare(data.password,scanId.password);
                    
        if(!isMatch) return res.status(401).json({error:"Invalid Password"});

        const resultChaning = await customerChangingEmail(data);

        if (resultChaning.success) {
            return res.status(200).json({message:"Updated Successfully"});
        } else {
            return res.status(500).json({message:"Failed Updating Email",error:resultChaning.error});
        }

    }catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

export const updatingCustomerPassword = async (req:NextApiRequest,res:NextApiResponse) => {
    try{
            const data = zodValidatorHelper(validationUpdatePassword,req.body,res);

            const scanId = await prisma.customer.findUnique({where:{id:data.id}});
            
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
            
            const resultChaning = await customerChangingPassword(data,hashedPassword);

                if (resultChaning.success) {
                    return res.status(200).json({message:"Updated Successfully"});
        
                } else {
                    return res.status(500).json({message:"Failed Updating Password",error:resultChaning.error});
                }

    }catch(error){
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}