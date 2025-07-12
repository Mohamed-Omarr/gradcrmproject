import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const getCustomerInfoDB = async ( userId:string )=>{
        try{
            const user = await  prisma.customer.findUnique({
                where:{
                    id:userId,
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                }
            })
            return {success:true,data:user}
        }catch(err){
            return {success:false,error:err}
        }
}