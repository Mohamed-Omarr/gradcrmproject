import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const customerChangingEmail = async(data:update_email) => {
    try {
        prisma.$transaction([
            prisma.customer.update({
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
            })
        ])
        return {success:true,message: "updated email successfully"}
    } catch (err){
        return {success:false,error:err}
    }
}