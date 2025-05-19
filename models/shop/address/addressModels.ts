import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const addingAddress = async (data:Address) => {
    try{
        const theAddress = await prisma.address.create({
            data:{
                addressType:data.addressType,
                street:data.street,
                customerId:data.customerId,
                country:data.country,
                city:data.city,
                zipCode:data.zipCode,
            },
            
        })
        return { success: true, address:theAddress};
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

export const gettingAddress = async (userId:string) => {
    try{
        const all_Address = await prisma.address.findMany({
            where:{
                customerId:userId
            },
            select:{
                addressType:true,
                street:true,
                country:true,
                city:true,
                zipCode:true,
                default:true
            }
        })
        return { success: true, allAddress:all_Address};
    }catch(error){
        return { success: false, error: `Failed to get all address ${error}` };
    }
}


// set address to default
export const setAddressToDefault = async (data:setToDefaultAddress) => {
    try{
        await prisma.address.update({
            where:{
                customerId:data.customerId,
                id:data.previousDefaultAddressId,
            },
            data:{
                default:false,
            }
        }).then(()=>{
            prisma.address.update({
            where:{
                customerId:data.customerId,
                id:data.id,
            },
            data:{
                default:true,
            }
        })
        })
        return { success: true};
    }catch(error){
        return { success: false, error: `Failed set to default ${error}` };
    }
}