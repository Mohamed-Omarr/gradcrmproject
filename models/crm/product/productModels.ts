import prisma from "../../../_lib_backend/prismaClient/PrismaClient"


export const addProducts = async (data:Product,thumbnailImage:string) => {
    
    try{

        const addedProduct = await prisma.product.create({
            data:{
                name:data.name,
                price: Number(data.price),
                description: data.description,
                qty:Number(data.qty),
                ownerId:data.ownerId,
                categoryId:Number(data.categoryId),
                thumbnail:thumbnailImage,
            },
            include:{
                category:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return {success:true,createdNewProduct:addedProduct}
    }catch(error){
        return {success:false,error: `Failed to create new stock ${error}`}
    }
}

export const deleteProducts = async (data:removeProduct) => {
    try{
        await prisma.product.delete({
            where:{
                id:data.id,
                ownerId: data.ownerId
            }
        })
        return {success:true}
    }catch(error){
        return { success: false, error: `Failed to delete product ${error}` };
    }
}

export const updateProducts = async (data:Product,thumbnailImage:string) => {
    try{
        const updatedProduct = await prisma.product.update({
            where:{
                id: data.id,
                ownerId: data.ownerId
            },
            data:{
                name:data.name,
                price: data.price,
                description: data.description,
                qty:data.qty,
                categoryId:data.categoryId,
                thumbnail:thumbnailImage,
            },
            include:{
                category:{
                    select:{
                        name:true
                    }
                },
                colors:{
                    select:{
                        name:true,
                        code:true,
                        id:true,
                    }
                },
                sizes:{
                    select:{
                        name:true,
                        code:true,
                        id:true,
                    }
                }
            }
        })

        return { success: true, product: updatedProduct  }; // Return an object instead of just calling await
    }catch(error){
        return { success: false, error: `Failed to update product ${error}` };
    }
}

export const getProducts = async (ownerId:string) => {
    try{
        const allProduct = await prisma.product.findMany({
            where:{
                ownerId:ownerId
            },
            include:{
                category:{
                    select:{
                        name:true
                    }
                },
                colors:{
                    select:{
                        name:true,
                        code:true,
                        id:true,
                    }
                },
                sizes:{
                    select:{
                        name:true,
                        code:true,
                        id:true,
                    }
                }
            }
        })
        return { success: true, products: allProduct };
    }catch(error){
        return { success: false, error: `Failed to get all products ${error}` };
    }
}