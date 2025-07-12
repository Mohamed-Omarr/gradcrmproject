import { NextApiRequest , NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { ValidateUserLogin, ValidateUserRegister } from "../../../_lib_backend/validation/authValidation";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { formatZodError } from "../../../_lib_backend/validation/zodHelper/zodError";
import { generateToken } from "../../../_lib_backend/token/generateToken";
import { verifyToken } from "../../../_lib_backend/token/verifyToken";
import { deleteToken } from "../../../_lib_backend/token/deleteToken";
import jwt from "jsonwebtoken";
import { customerLogoutDB } from "../../../models/shop/auth/customerLogoutModel";
import { createCustomerDB } from "../../../models/shop/auth/createCustomerModel";
import { customerLoginDB } from "../../../models/shop/auth/customerLoginModel";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";

export const customer_register = async (req:NextApiRequest , res:NextApiResponse) => {
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

            const pushingDB = await createCustomerDB(user)

            if (pushingDB.success){
                return res.status(201).json({message:"User register successfully"})
            }
            return res.status(400).json({message:"Failed Registration",error:pushingDB.error})

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

export const customer_login = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
            const data = zodValidatorHelper(ValidateUserLogin,req.body,res);
            
            const user = await prisma.customer.findUnique({where:{email:data.email},select:{id:true,email:true,name:true,role:true,password:true}})

            if (!user) return res.status(404).json({error:"Email not exits"});

            const isMatch = await bcrypt.compare(data.password,user.password);
            
            if(!isMatch) return res.status(401).json({error:"Invalid credentials"});

            const limitAccess = {
                id:user.id,
                role:user.role,
            }
            //  await prisma model
            const pushingDB = await customerLoginDB(limitAccess.id,limitAccess.role);

            if(pushingDB.success){
                // await generate the token
                const tokenResult =  await generateToken(limitAccess,res);
                if (tokenResult.success) {
                    return res.status(200).json({message:"Login successfully",accessToken:tokenResult.accessToken})
                } else {
                    return res.status(500).json({message:"Failed to login",error:tokenResult.error})
                }
            }else {
                return res.status(400).json({message:"Failed to login",error:pushingDB.error})
            }
        
    } catch(error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

export const customer_logout = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
        
        const data:logout = req.body;
            
            const user = await prisma.customer.findUnique({where:{id:data.userId}})

            if (!user) return res.status(404).json({error:"User not found"});
            
            //  await prisma model
            const user_logging_out = await customerLogoutDB(user.id,user.role);

            if(user_logging_out.success){
                deleteToken(res,user.role);
                return res.status(200).json({message:"Logout Successfully"})
            }else{
                return res.status(400).json({error:`Failed logging out: ${user_logging_out.error}`})
            }

    } catch(error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

export const frequentLogout = async (req:NextApiRequest,res:NextApiResponse) => {
    const redirect = req.query.redirect || "/shop/auth/customerLogin";
    const token = req.cookies["shop_token"];
    if (!token) {
      return res.redirect(302, redirect as string);
    }

    try {
      const decoded = jwt.decode(token) as { id: string; role: string };
      if (!decoded?.id || !decoded?.role) throw new Error("Invalid token");

      // Optional: validate user from DB before logout
      const user = await prisma.customer.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return res.redirect(302, redirect as string);
      }

      await prisma.$transaction([
        prisma.logout.create({
          data: {
            userType: decoded.role,
            userId: decoded.id,
          },
        }),
        prisma.customer.update({
          where: { id: decoded.id },
          data: { refreshToken: null },
        }),
      ]);

        deleteToken(res,user.role); // remove cookie
    } catch (err) {
      console.error("Logout error:", err);
    }

    return res.redirect(302, redirect as string);

}


export const info_of_customer = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json("Not Authorized User");
        }
        const decoded = jwt.decode(token) as {role:string}

        const result = await verifyToken(token,decoded.role);

        if (!result.success && result.status){
            return res.status(result.status).json({message:"User not found",error:result.DBerror})
        }else if (!result.success){
            return res.status(401).json({message:"Not Authorized",error:result.error})
        }

        return res.status(200).json({message:"Received Info",user:result.user})

    } catch(error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}

