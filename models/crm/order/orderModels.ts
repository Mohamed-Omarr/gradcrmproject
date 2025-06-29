import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const getOrders = async () => {
  try {
   const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id:true,
        createdAt: true,
        total: true,
        status: true,
        currency: true,
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: true,
      },
    });
    return { success: true, orders };
  } catch (error) {
    return { success: false, error: `Failed fetching admin orders: ${error}` };
  }
};



export const updatingOrderStatus = async (data:UpdateOrderStatus) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: data.orderId },
      data: { status: data.newStatus },
    });

    return { success: true, order: updatedOrder };
  } catch (error) {
    return { success: false, error: `Failed updating order status: ${error}` };
  }
};

