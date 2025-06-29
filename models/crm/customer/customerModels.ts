import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const deleteCustomer = async (data:removeStock) => {
   try{
    await prisma.stock.delete({
        where:{
            id: data.id,
            ownerId: data.ownerId
        }
    })
    const returnUnselectCategory = await prisma.category.findMany({
        where:{
            ownerId: data.ownerId,
            stock:null,
        },
        select:{
            name:true,
            id:true,
        }
    })
    return {success:true,unselectedCategory:returnUnselectCategory}
   }catch(error){
    return { success: false, error: `Failed to delete stock ${error}` };
   }
}

export const getCustomers = async () => {
    try {
        const allCustomers = await prisma.customer.findMany({
            select:{
                id:true,
                email:true,
                name:true,
                createdAt:true,
                Order:{
                    select:{
                        id:true,
                        total:true,
                        currency:true,
                        updatedAt:true,
                    }
                },
                address:{
                    where:{
                        default:true,
                    },
                    select:{
                        id:true,
                        street:true,
                        zipCode:true,
                        city:true,
                        country:true,
                        addressType:true,
                    }
                }
            }
        })
        return { success: true, customers: allCustomers };
    }catch(error){
        return { success: false, error: `Failed to get all stocks ${error}` };
    }
}