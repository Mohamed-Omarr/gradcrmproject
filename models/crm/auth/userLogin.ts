import prisma from "../../../_lib_backend/prismaClient/PrismaClient"


export const userLogin = async (userId:string,userRole:string) => {
    try {
        await prisma.login.create({
            data:{
                userType:userRole,
                userId,
            }
        })
        return {success:true}
    }catch(err) {
        return {success:false,error:err}
    }
}