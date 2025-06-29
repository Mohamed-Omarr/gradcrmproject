import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const addingAddress = async (data:Address) => {
    try{ 
        const scanCustomerAddress = await prisma.customer.findUnique({
                where:{
                    id:data.customerId,
                },
                select:{
                    address:{
                        select:{
                            default:true
                        }
                    }
                }
            });
            const checkDefaultAddress = scanCustomerAddress?.address.some((x)=>x.default === true);

            if (checkDefaultAddress) {
                await prisma.address.create({
                    data:{
                        addressType:data.addressType,
                        street:data.street,
                        customerId:data.customerId,
                        country:data.country,
                        city:data.city,
                        zipCode:data.zipCode,
                        default:data.default
                    },
                })
            } else {
                await prisma.address.create({
                    data:{
                        addressType:data.addressType,
                        street:data.street,
                        customerId:data.customerId,
                        country:data.country,
                        city:data.city,
                        zipCode:data.zipCode,
                        default:data.default
                    },
                })
            }
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed creating address ${error}` };
    }
}

export const updatingAddress = async (data:Address) => {
    try{
        const updatedTheAddress = await prisma.address.update({
            where:{
                customerId:data.customerId,
                id:data.id,
            },
            data:{
                addressType:data.addressType,
                street:data.street,
                customerId:data.customerId,
                country:data.country,
                city:data.city,
                zipCode:data.zipCode,
            }
        })
        return { success: true, address:updatedTheAddress};
    }catch(error){
        return { success: false, error: `Failed updating address ${error}` };
    }
}

export const deletingAddress= async (data:DeleteAddress) => {
    try{
            await prisma.address.delete({
            where:{
                id:data.id,
                customerId:data.customerId
            }
        })
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed to delete address ${error}` };
    }
}

export const gettingAddress = async (userId: string) => {
  try {
    const all_Address = await prisma.address.findMany({
      where: {
        customerId: userId,
      },
      select: {
        id: true,
        addressType: true,
        street: true,
        country: true,
        city: true,
        zipCode: true,
        default: true,
      },
    });

    const hasDefault = all_Address.some((addr) => addr.default === true);

    if (hasDefault) {
      return { success: true, allAddress: all_Address };
    }

    // If no default, pick the first one and set it to default
    if (all_Address.length >= 1) {
      const firstAddress = all_Address[0];

      await prisma.address.update({
        where: {
          id: firstAddress.id,
        },
        data: {
          default: true,
        },
      });

      // Fetch updated list again
      const updatedAddressList = await prisma.address.findMany({
        where: { customerId: userId },
        select: {
          id: true,
          addressType: true,
          street: true,
          country: true,
          city: true,
          zipCode: true,
          default: true,
        },
      });

      return { success: true, allAddress: updatedAddressList };
    } else {
      return { success: true, allAddress: [] };
    }
  } catch (error) {
    return { success: false, error: `Failed to get all addresses: ${error}` };
  }
};



// set address to default
export const setAddressToDefault = async (data:setToDefaultAddress) => {
    try{
        await prisma.$transaction([
            prisma.address.update({
            where:{
                customerId:data.customerId,
                id:data.previousDefaultAddressId,
            },
            data:{
                default:false,
            }
        }),
        prisma.address.update({
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