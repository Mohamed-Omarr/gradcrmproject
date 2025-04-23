import prisma from "../../../_lib_backend/prismaClient/PrismaClient"


export const customerLoginDB = async (userId:string,userRole:string) => {
    try {
        prisma.login.create({
            data:{
                userType:userRole,
                userId:userId,
            }
        })
        
        return {success:true}
    } catch(err) {
        return {success:false,error:err}
    }
}