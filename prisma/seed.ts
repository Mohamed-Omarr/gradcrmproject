import prisma from "../_lib_backend/prismaClient/PrismaClient";

async function main() {
    const createAdmin = await prisma.register.create({
        data:{
            email: "fakemails@gmail.com",
            name: "testing",
            password:"12345",
            confirmPassword:"12345",
        }
    });
}

main().then(async()=> await prisma.$disconnect).catch(async(e)=>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1)
})