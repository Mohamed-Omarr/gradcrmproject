import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const changingEmail = async(data:update_email) => {
    try {
        await prisma.$transaction([
             prisma.admin.update({
                where:{
                    id:data.id,
                    email:data.previousEmail
                },
                data:{
                    email:data.newEmail,
                }
            }),
            prisma.register.update({
                where:{
                    email:data.previousEmail
                },
                data:{
                    email:data.newEmail,
                }
            }),
        ])

        return  {success:true}
    } catch (err) {
        return  {success:false,error:err}
    }
}