import prisma from "../../../_lib_backend/prismaClient/PrismaClient"


export const customerChangingPassword = async(customerData:update_password,hashedPassword:string) => {
    // passing the hashedPassword instead of customerData.newPassword.
    try {
        await prisma.$transaction([
            prisma.customer.update({
                where:{
                    id:customerData.id,
                    email:customerData.email
                },
                data:{
                    password:hashedPassword,
                }
            }),
            prisma.register.update({
                where:{
                    email:customerData.email
                },
                data:{
                    password:hashedPassword,
                    confirmPassword:hashedPassword,
                }
            })
        ]);
        return {success:true,message: "updated password successfully"}
    } catch(err) {
        return {success:false,error:err}
    }
}