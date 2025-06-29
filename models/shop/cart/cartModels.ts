
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const getCartDB= async (customerId:string) => {
    try{
        const gettingCart =  await prisma.cart.findUnique({
            where:{
                customerId:customerId,
            },
            select:{
                items:{
                    select:{
                        id:true,
                        productId:true,
                        quantity:true,
                        product:true,
                        size:true,
                        color:true,
                    }
                },
            }
        })
        return { success: true, cart: gettingCart };
    }catch(error){
        return { success: false, error: `Failed to get cart ${error}` };
    }
}