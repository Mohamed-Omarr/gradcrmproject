import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const get_all_product = async () => {
    try{
        const allProduct = await prisma.product.findMany({
                select:{
                    id:true,
                    name:true,
                    description:true,
                    price:true,
                    ownerId:true,
                    qty:true,
                    category:true,
                }
                })
        return { success: true, products: allProduct };
    }catch(error){
        return { success: false, error: `Failed to get all products ${error}` };
    }
}