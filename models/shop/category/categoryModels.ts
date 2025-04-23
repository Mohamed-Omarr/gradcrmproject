import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

export const getCategories = async () => {
    try{
        const allCategories =  await prisma.category.findMany({
                select:{
                id:true,
                name:true,
                products:true,
            }
        })
        return { success: true, categories: allCategories };
    }catch(error){
        return { success: false, error: `Failed to get all categories ${error}` };
    }
}