import prisma from "../../../_lib_backend/prismaClient/PrismaClient"


export const userLogin = async (userId:string,userRole:string) => {
    return await
        prisma.login.create({
            data:{
                userType:userRole,
                userId,
            }
        })
}