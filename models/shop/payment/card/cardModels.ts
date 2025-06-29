import prisma from "../../../../_lib_backend/prismaClient/PrismaClient";

export const addingCard = async (data:Card) => {
    try{ 
        const scanCustomerCard = await prisma.customer.findUnique({
                where:{
                    id:data.customerId,
                },
                select:{
                    card:{
                        select:{
                            default:true
                        }
                    }
                }
            });
            const checkDefaultCard = scanCustomerCard?.card.some((x)=>x.default === true);

            if (checkDefaultCard) {
                await prisma.card.create({
                    data:{
                        type:data.type,
                        customerId:data.customerId,
                        default:data.default,
                        number:data.number,
                        expiry:data.expiry
                    },
                })
            } else {
                await prisma.card.create({
                    data:{
                        type:data.type,
                        customerId:data.customerId,
                        default:data.default,
                        number:data.number,
                        expiry:data.expiry
                    },
                })
            }
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed creating card ${error}` };
    }
}

export const updatingCard = async (data:Card) => {
    try{
        const updatedTheCard = await prisma.card.update({
            where:{
                customerId:data.customerId,
                id:data.id,
            },
            data:{
                type:data.type,
                customerId:data.customerId,
                default:data.default,
                number:data.number,
                expiry:data.expiry
            }
        })
        return { success: true, card:updatedTheCard};
    }catch(error){
        return { success: false, error: `Failed updating card ${error}` };
    }
}

export const deletingCard = async (data:DeleteCard ) => {
    try{
            await prisma.card.delete({
            where:{
                id:data.id,
                customerId:data.customerId
            }
        })
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed to delete card ${error}` };
    }
}

export const gettingCard = async (userId: string) => {
  try {
    const all_Card = await prisma.savedCard.findMany({
      where: {
        customerId: userId,
      },
      select: {
        id: true,
        brand: true,
        isDefault: true,
        expiryYear:true,
        expiryMonth:true,
        holderName:true,
        stripePaymentMethodId:true,
      },
    });
      return { success: true, all_Card: all_Card };
  } catch (error) {
    return { success: false, error: `Failed to get all cards: ${error}` };
  }
};



// set card to default
export const setCardToDefault = async (data:setToDefaultCard) => {
    try{
        await prisma.$transaction([
            prisma.card.update({
            where:{
                customerId:data.customerId,
                id:data.previousDefaultCardId,
            },
            data:{
                default:false,
            }
        }),
        prisma.card.update({
            where:{
                customerId:data.customerId,
                id:data.id,
            },
            data:{
                default:true,
            }
        })
        ])
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed set to default ${error}` };
    }
}