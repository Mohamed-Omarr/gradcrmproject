import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const customerLogoutDB = async (userId:string,userRole:string) => {
    try {
        
        await Promise.all([
            prisma.logout.create({
                data:{
                    userType:userRole,
                    userId:userId,
                }
            }),

            prisma.customer.update({
                where:{
                    id:userId,
                },
                data:{
                    refreshToken:null,
                }
            })
        ])

        return {success:true}
    } catch (err) {
        return {success:false,error:err}
    }
}