import prisma from "../../../_lib_backend/prismaClient/PrismaClient"

interface adminData {
    name:string,
    email:string
}

export const createAdmin = async ( User:{data:adminData,hashedPassword:string} )=>{
    return await Promise.all([
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
}