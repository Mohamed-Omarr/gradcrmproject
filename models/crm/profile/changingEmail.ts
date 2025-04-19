import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const changingEmail = async(data:update_email) => {
    return Promise.all([
        await prisma.admin.update({
            where:{
                id:data.id,
                email:data.previousEmail
            },
            data:{
                email:data.newEmail,
            }
        }),
        await prisma.register.update({
            where:{
                email:data.previousEmail
            },
            data:{
                email:data.newEmail,
            }
        }),
    ])
    
}