import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const addingToCartDB = async (data:CartItem,userId:string) => {
  try {
    // Step 1: Ensure Cart exists or create it
    const cart = await prisma.cart.upsert({
      where: { customerId: userId },
      update: {},
      create: {
        customer: { connect: { id:userId} },
      },
    });

    // Step 2: Check if CartItem for this product already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
      },
    });

    if (existingItem) {
      // Step 3a: Update the existing item's quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + data.quantity,
        },
      });
    } else {
      // Step 3b: Create a new cart item
      await prisma.cartItem.create({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: data.productId } },
          quantity: data.quantity,
          size:data.size, 
          color:data.color     
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed adding to cart: ${error}` };
  }
};


export const updatingCartItemDB = async (data:CartItem) => {
  try {
    // Step 1: Ensure Cart exists or create it
    await prisma.cartItem.update({
      where:{
        id:data.id,
        productId:data.productId,
      },
      data:{
        quantity:data.quantity
      }
    })

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed updating item of cart: ${error}` };
  }
};


export const deletingFromCartDB= async (data:RemoveCartItem) => {
    try{
        await prisma.cartItem.delete({
            where:{
                id:data.id,
            }
        })
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed to delete item ${error}` };
    }
}