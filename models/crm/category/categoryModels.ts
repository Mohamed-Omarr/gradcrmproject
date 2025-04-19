import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const addCategories = async (data:Category) => {
    try{
        const addedCategory = await prisma.category.create({
            data:{
                name:data.name,
                description: data.description,
                ownerId:data.ownerId,
            },
            include:{
                stock: {
                    select:{
                        name:true,
                    }
                }
            }
        })
        
        return { success: true,addedCategory:addedCategory};
    }catch(error){
        return { success: false, error: `Failed to create new category ${error}` };
    }
}

export const deleteCategories = async (data:removeCategory) => {
    try{
        // check if the category has foreign key with any other tables
        const countStock = await prisma.stock.count({
            where:{
                categoryId:Number(parseInt(data.id)),
            }
        });

        const countProduct = await prisma.product.count({
            where:{
                categoryId:Number(parseInt(data.id)),
            }
        });

        //deleting columns if any exits
        if(countProduct > 0){
            await prisma.product.deleteMany({
                where:{
                    ownerId: data.ownerId,
                    categoryId:Number(parseInt(data.id)),
                }
            })
        }

        if(countStock > 0){
            await prisma.stock.deleteMany({
                where:{
                    ownerId: data.ownerId,
                    categoryId:Number(parseInt(data.id)),
                }
            })
        }

        await prisma.category.delete({
            where:{
                id: Number(parseInt(data.id)),
                ownerId: data.ownerId
            }
        })
        
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed to delete category ${error}` };
    }
}


export async function updateCategories(data:Category) {
    try {
        const updatedCategory = await prisma.category.update({
            where: { id: Number(data.id) },
            data: { description: data.description }
        });
        return { success: true, category: updatedCategory }; // Return an object instead of just calling await
    } catch (error) {
        return { success: false, error: `Failed to update category ${error}` };
    }
}




export const getCategories = async (ownerId:string) => {
    try{
        const allCategories =  await prisma.category.findMany({
            where:{
                ownerId:ownerId
            },
            include:{
                stock:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return { success: true, categories: allCategories };
    }catch(error){
        return { success: false, error: `Failed to get all categories ${error}` };
    }
}