import prisma from "../../../../_lib_backend/prismaClient/PrismaClient"

export const creating_sizes = async (data:Sizes) => {
    try{
        const sizes = await prisma.sizes.create({
                        data:{
                            code: data.code,
                            name:data.name,
                        }
                })
        return { success: true, created_sizes: sizes };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}

export const updating_sizes = async (data:Sizes) => {
    try{
        const sizes = await prisma.sizes.update({
                    where:{
                        id:data.id,
                    },
                    data:{
                        code:data.code,
                        name:data.name,
                    }
                })
        return { success: true, updated_sizes: sizes };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}

export const deleting_sizes = async (data:removeSizes) => {
    try{
        await prisma.sizes.delete({
                    where:{
                        id:data.id,
                    },
                })
        return { success: true };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}

export const getting_sizes = async () => {
    try{
        const allSizes = await prisma.sizes.findMany({
            select:{
                id:true,
                name:true,
                code:true,
            }
        })
        return { success: true , sizes:allSizes};
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}



// handle size attributes of product 
export const creating_product_size = async (data:SizeOfProduct) => {
    try{
        const sizes = await prisma.product.update({
                    where:{
                        id:data.productId,
                    },
                    data:{
                        sizes:{
                            connect:data.sizeIds.map((id) => ({ id }))
                        }
                    },
                    include:{
                        sizes:true
                    }
                })
        return { success: true, created_sizes_for_product: sizes };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}


export const updating_product_size = async (data:SizeOfProduct) => {
    try{
        const sizes = await prisma.product.update({
                    where:{
                        id:data.productId,
                    },
                    data:{
                        sizes:{
                            set:data.sizeIds.map((id) => ({ id }))
                        }
                    },
                    include:{
                        sizes:true
                    }
                })
        return { success: true, updated_sizes_for_product: sizes };
    }catch(error){
        return { success: false, error: `Failed to get all sizes ${error}` };
    }
}



