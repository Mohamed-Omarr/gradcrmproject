import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const get_all_product = async () => {
    try{
        const allProduct = await prisma.product.findMany({
                select:{
                    id:true,
                    name:true,
                    description:true,
                    price:true,
                    ownerId:true,
                    qty:true,
                    thumbnail:true,
                    colors:true,
                    sizes:true,
                    category:{
                        select:{
                            name:true,
                            id:true,
                        }
                    },
                    ratings:{
                        select:{
                            score:true,
                        }
                    },
                    wishlist:{
                        select:{
                            productId:true,
                            customerId:true,
                        }
                    }
                },
                })
                
        return { success: true, products: allProduct };
    }catch(error){
        return { success: false, error: `Failed to get all products ${error}` };
    }
}

export const get_product_by_id = async (productId:string) => {
    try{
        // productId must be a number but because of api it coming as string
        const product = await prisma.product.findUnique({
                where:{
                    id:Number(productId),
                },
                select:{
                    id:true,
                    name:true,
                    description:true,
                    price:true,
                    ownerId:true,
                    qty:true,
                    thumbnail:true,
                    colors:true,
                    sizes:true,
                    category:{
                        select:{
                            name:true,
                            id:true,
                        }
                    },
                    ratings:{
                        select:{
                            id:true,
                            score:true,
                            review:true,
                            customerId:true,
                            createdAt:true,
                            updatedAt:true,
                            customer:{
                                select:{
                                    id:true,
                                    name:true,
                                }
                            }
                        }
                    },
                    wishlist:{
                        select:{
                            productId:true,
                            customerId:true,
                        }
                    }
                    
                }
                })
        return { success: true, product: product };
    }catch(error){
        return { success: false, error: `Failed to get  product by id ${error}` };
    }
}


export const get_products_by_category = async (categoryId:string) => {
    try{
        // productId must be a number but because of api it coming as string
        const products = await prisma.category.findUnique({
                where:{
                    id:Number(categoryId),
                },
                select:{
                    products:{
                        select:{
                            name:true,
                            thumbnail:true,
                            price:true,
                            ratings:{
                                select:{
                                    score:true,
                                }
                            },
                            
                        },
                        
                        
                    }
                }
                })
        return { success: true, products: products };
    }catch(error){
        return { success: false, error: `Failed to get  product by id ${error}` };
    }
}