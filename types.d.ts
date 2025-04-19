type Product = {
    id:string
    name:string
    price: number
    description: string | null
    ownerId: string
    qty: number
    category:   Category,
    categoryId:  number | null
}

type removeProduct = {
    id:string,
    ownerId: string,
}


type Category = {
    // id will become number
    id:string,
    name:string
    description: string | null
    products?:   Product[],
    stock?:       Stock
    ownerId: string
}

type removeCategory = {
    // id will become number
    id:string,
    ownerId: string,
}


type Stock = {
    // id will become number
    id:string,
    name:string,
    description: string | null,
    category:   Category,
    categoryId: string
    ownerId: string
}

type removeStock = {
     // id will become number
    id:string,
    ownerId: string
}


type adminData = {
    email:string,
    role:string,
    name:string,
    id:string,
}


type update_name = {
    id:string,
    previousName:string,
    newName:string,
}


type update_email = {
    id:string,
    previousEmail:string,
    newEmail:string,
    password:string,
}


type update_password = {
    id:string,
    email:string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
}

type logout = {
    userId:string;
    userRole:string,
}