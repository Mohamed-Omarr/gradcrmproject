import prisma from "../../../../_lib_backend/prismaClient/PrismaClient";

export const addingOrder = async (data: CreateOrderPayload) => {
  try {
     await prisma.order.create({
      data: {
        stripePaymentIntentId: data.stripePaymentIntentId,
        customerId: data.customerId,
        total: data.total,
        currency: data.currency,
        status: "processing", // default on create
        orderItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed creating order: ${error}` };
  }
};

export const gettingOrder = async (customerId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
            select:{
                id:true,
                orderId:true,
                productId:true,
                name:true,
                image:     true,
                color:    true,
                size:      true,
                quantity:  true,
                price:     true,
            }
        },
      },
    });

    return { success: true, orders };
  } catch (error) {
    return { success: false, error: `Failed fetching customer orders: ${error}` };
  }
};
