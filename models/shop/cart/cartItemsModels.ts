import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const addingToCartDB= async (data:any) => {
    try{
        await prisma.cartItem.create({
            data:{
                productId:Number(data.productId),
                cartId:Number(data.cartId),
                quantity:Number(data.quantity),
                total:Number(data.total),
                sku:data.sku
            }
        })
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed adding to  cart ${error}` };
    }
}

export const deletingFromCartDB= async (data:any) => {
    try{
        await prisma.cartItem.delete({
            where:{
                id:Number(data.id),
            }
        })
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed to delete item ${error}` };
    }
}