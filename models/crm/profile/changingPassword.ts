import prisma from "../../../_lib_backend/prismaClient/PrismaClient"



export const changingPassword = async(adminData:update_password,hashedPassword:string) => {
    // passing the hashedPassword instead of adminData.newPassword.
    return await Promise.all([
        prisma.admin.update({
            where:{
                id:adminData.id,
                email:adminData.email
            },
            data:{
                password:hashedPassword,
            }
        }),
        prisma.register.update({
            where:{
                email:adminData.email
            },
            data:{
                password:hashedPassword,
                confirmPassword:hashedPassword,
            }
        })
    ])
}