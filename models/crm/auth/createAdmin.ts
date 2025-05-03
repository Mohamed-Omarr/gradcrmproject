import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

interface adminData {
    name:string,
    email:string,
    hashedPassword:string,
}

export const createAdmin = async ( User:{data:adminData,hashedPassword:string} )=>{
    try{
        await prisma.$transaction([
            prisma.register.create({
                data:{
                    email:User.data.email,
                    name:User.data.name,
                    password:User.hashedPassword,
                    confirmPassword:User.hashedPassword
                }
            }),
            prisma.admin.create({
                data:{
                    email:User.data.email,
                    name:User.data.name,
                    password:User.hashedPassword,
                    role: "ADMIN"
                }
            })
        ])
        return {success:true}
    }catch(err){
        return {success:false,error:err}
    }
}