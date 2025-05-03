import prisma from "../../../../_lib_backend/prismaClient/PrismaClient"

export const creating_colors = async (data:Colors) => {
    try{
        const colors = await prisma.colors.create({
            data:{
                code:data.code,
                name:data.name,
                ownerId:data.ownerId
            }
        })
        return { success: true, created_colors: colors };
    }catch(error){
        return { success: false, error: `Failed to create color ${error}` };
    }
}


export const updating_colors = async (data:Colors) => {
    try{
        const colors = await prisma.colors.update({
                    where:{
                        id:data.id,
                        ownerId:data.ownerId
                    },
                    data:{
                        code:data.code,
                        name:data.name,
                    }
                })
        return { success: true, updated_colors: colors };
    }catch(error){
        return { success: false, error: `Failed to update color ${error}` };
    }
}

export const deleting_colors = async (data:removeSizes) => {
    try{
        await prisma.colors.delete({
                    where:{
                        id:data.id,
                        ownerId:data.ownerId,
                    },
                })
        return { success: true };
    }catch(error){
        return { success: false, error: `Failed to delete color ${error}` };
    }
}


export const getting_colors = async (adminId:string) => {
    try{
        const allColors = await prisma.colors.findMany({
            select:{
                id:true,
                name:true,
                code:true,
            },
            where:{
                ownerId:adminId
            }
        })
        return { success: true, colors:allColors };
    }catch(error){
        return { success: false, error: `Failed to get all colors ${error}` };
    }
}




// handle color attributes of product 
export const creating_product_color = async (data:ColorOfProduct) => {
    try{
        const colors = await prisma.product.update({
                    where:{
                        id:data.productId,
                    },
                    data:{
                        colors:{
                            connect:data.colorIds.map((id) => ({ id }))
                        }
                    },
                    include:{
                        colors:true
                    }
                })
        return { success: true, created_colors_for_product: colors };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}


export const updating_product_color = async (data:ColorOfProduct) => {
    try{
        const colors = await prisma.product.update({
                    where:{
                        id:data.productId,
                    },
                    data:{
                        colors:{
                            set:data.colorIds.map((id) => ({ id }))
                        }
                    },
                    include:{
                        colors:true
                    }
                })
        return { success: true, updated_colors_for_product: colors };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}
