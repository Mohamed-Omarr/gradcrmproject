import prisma from "../../../_lib_backend/prismaClient/PrismaClient"



export const changingPassword = async(adminData:update_password,hashedPassword:string) => {
    // passing the hashedPassword instead of adminData.newPassword.
    try {
        await prisma.$transaction([
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
        return {success:true}
    } catch(err) {
        return {success:false,error:err}
    }
}