import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const creating_rate = async (data:Rate) => {
    try{
        const rate = await prisma.rating.create({
                        data:{
                            score: data.score,
                            review:data.review,
                            productId: data.productId,
                            customerId:data.customerId,
                        }
                })
        return { success: true, created_rate: rate };
    }catch(error){
        return { success: false, error: `Failed to get all products ${error}` };
    }
}


export const updating_rate = async (data:Rate) => {
    try{
        const rate = await prisma.rating.update({
                        where:{
                            id:data.id,
                            productId:data.productId,
                            customerId:data.customerId,
                        },
                        data:{
                            score:data.score,
                            review:data.review,
                        }
                })
        return { success: true, updated_rate: rate };
    }catch(error){
        return { success: false, error: `Failed to get all products ${error}` };
    }
}


export const deleting_rate = async (data:Rate) => {
    try{
        await prisma.rating.delete({
                        where:{
                            id:data.id,
                            productId:data.productId,
                            customerId:data.customerId,
                        },
                })
        return { success: true };
    }catch(error){
        return { success: false, error: `Failed to get all products ${error}` };
    }
}

