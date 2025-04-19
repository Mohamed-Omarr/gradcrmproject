import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const userLogout = async (userId:string,userRole:string) => {
    try {
        
        await Promise.all([
            prisma.logout.create({
                data:{
                    userType:userRole,
                    userId:userId,
                }
            }),

            prisma.admin.update({
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