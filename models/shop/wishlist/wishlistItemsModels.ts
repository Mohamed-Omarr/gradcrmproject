import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const addingToWishlistItems = async (data:WishlistItems) => {
    try{
        await prisma.$transaction([
            prisma.wishlistItems.create({
                data: {
                    customerId:data.customerId,
                    productId:data.productId,
                }
            }),
            prisma.product.update({
                where:{
                    id:data.productId,
                },
                data: {
                    isWishListed:true,
                }
            }),
        ])
        return { success: true };
    }catch(error){
        return { success: false, error: `Failed adding to wishlist ${error}` };
    }
}

export const deletingWishlistItems = async (data:DeleteWishlistItems) => {
    try{
        await prisma.$transaction([
            prisma.wishlistItems.delete({
            where: {
                customerId: data.customerId,
                productId: data.productId,
            },
        }),
        prisma.product.update({
                where:{
                    id:data.productId,
                },
                data: {
                    isWishListed:false,
                }
            }),
        ])
        return { success: true };
    }catch(error){
        return { success: false, error: `Failed removing product from wishlist ${error}` };
    }
}



export const getWishlistItems = async (customerId:string) => {
    try{
        const allWishLists =  await prisma.wishlistItems.findMany({
            where:{
                customerId:customerId
            },
            include:{
                product:{
                    select:{
                    id:true,
                    name:true,
                    price:true,
                    thumbnail:true,
                    category:{
                        select:{
                            name:true,
                        }
                    },
                    ratings:{
                        select:{
                            score:true,
                        }
                    },
                }
                }
            }
        })
        return { success: true, wishlistItems: allWishLists };
    }catch(error){
        return { success: false, error: `Failed to get all wishlists ${error}` };
    }
}