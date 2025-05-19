import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const getCartDB= async (customerId:string) => {
    try{
        const gettingCart =  await prisma.cart.findUnique({
            where:{
                customerId:customerId,
            },
            select:{
                items:true,
            }
        })
        return { success: true, cart: gettingCart };
    }catch(error){
        return { success: false, error: `Failed to get cart ${error}` };
    }
}