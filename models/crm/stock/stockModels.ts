import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const addStocks = async (data:Stock) => {
    try{
        const addedStock =  await prisma.stock.create({
            data:{
                name:data.name,
                categoryId: Number(parseInt(data.categoryId)),
                ownerId:data.ownerId,
                description:data.description
            },
            include:{
                category:{
                    select:{
                        name:true
                    }
                },
                
            }
        })
        return {success:true,createdNewStock:addedStock}
    }catch(error){
        return { success: false, error: `Failed to create new stock ${error}` };
    }
}

export const deleteStocks = async (data:removeStock) => {
   try{
    await prisma.stock.delete({
        where:{
            id: Number(parseInt(data.id)),
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

export const updateStocks = async (data:Stock) => {
    
    try{
    const updatedStock = await prisma.stock.update({
        where:{
            id: Number(parseInt(data.id)),
            ownerId: data.ownerId
        },
        data:{
            name:data.name,
            description: data.description,
            categoryId: Number(parseInt(data.categoryId)),
        },
        include:{
            category:{
                select:{
                    name:true
                }
            }
        }
    })

    const updatedCategory = await prisma.category.findMany({
        where:{
            ownerId: data.ownerId,
            stock:null,
        },
        select:{
            name:true,
            id:true,
        }
    })

    return { success: true, stock: updatedStock , categories:updatedCategory }; // Return an object instead of just calling await
    
    }catch(error){
    return { success: false, error: `Failed to update stock ${error}` };

    }
}



export const getStocks = async (ownerId:string) => {
    try {
        const allStock =  await prisma.stock.findMany({
            where:{
                ownerId:ownerId
            },
            include:{
                category:{
                    select:{
                        name:true,
                        id:true,
                        products:true,
                    }
                },
                
            }
        })
        return { success: true, stocks: allStock };
    }catch(error){
        return { success: false, error: `Failed to get all stocks ${error}` };
    }
}