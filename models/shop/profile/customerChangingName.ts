import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const customerChangingName = async(data:update_name) => {
    try {
        await prisma.customer.update({
            where:{
                id:data.id,
                name:data.previousName
            },
            data:{
                name:data.newName,
            }
        })
        return {success:true,message: "updated name successfully"}
    } catch (err) {
        return {success:false,error:err}
    }
}