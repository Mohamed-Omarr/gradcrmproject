// import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

// export const get_all_product = async () => {
//     try{
//         const allProduct = await prisma.product.findMany({
//                 select:{
//                     id:true,
//                     name:true,
//                     description:true,
//                     price:true,
//                     ownerId:true,
//                     qty:true,
//                     category:{
//                         select:{
//                             name:true,
//                             id:true,
//                         }
//                     }
//                 }
//                 })
//         return { success: true, products: allProduct };
//     }catch(error){
//         return { success: false, error: `Failed to get all products ${error}` };
//     }
// }

// export const get_product_by_id = async (productId:string) => {
//     try{
//         // productId must be a number but because of api it coming as string
//         const product = await prisma.product.findUnique({
//                 where:{
//                     id:Number.parseInt(productId)
//                 },
//                 select:{
//                     id:true,
//                     name:true,
//                     description:true,
//                     price:true,
//                     ownerId:true,
//                     qty:true,
//                     category:{
//                         select:{
//                             name:true,
//                             id:true,
//                         }
//                     },
//                 }
//                 })
//         return { success: true, product: product };
//     }catch(error){
//         return { success: false, error: `Failed to get  product by id ${error}` };
//     }
// }