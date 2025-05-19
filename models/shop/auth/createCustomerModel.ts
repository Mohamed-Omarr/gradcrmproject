import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

interface customerData {
    name:string,
    email:string,
    hashedPassword:string
}

export const createCustomerDB = async ( User:{data:customerData,hashedPassword:string} )=>{
    try{
        await prisma.$transaction([
            prisma.register.create({
                data:{
                    name:User.data.name,
                    email:User.data.email,
                    password:User.hashedPassword,
                    confirmPassword:User.hashedPassword
                }
            }),
            prisma.customer.create({
                data:{
                    email:User.data.email,
                    name:User.data.name,
                    password:User.hashedPassword,
                    role:"CUSTOMER",
                }
            }),
        ]).then(async(e)=> {(
            await prisma.cart.create({
                data:{
                    customerId:e[1].id,
                }
            })
        )});

        return {success:true}
    }catch(err){
        return {success:false,error:err}
    }
}