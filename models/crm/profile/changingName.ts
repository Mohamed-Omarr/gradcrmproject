import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const changingName = async(data:update_name) => {
    try {
        await prisma.admin.update({
            where:{
                id:data.id,
                name:data.previousName
            },
            data:{
                name:data.newName,
            }
        })
        return {success:true}
    } catch (err) {
        return {success:false,error:err}
    }
}