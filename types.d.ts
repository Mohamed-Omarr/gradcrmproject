type Product = {
    id:number
    name:string
    price: number
    description: string | null
    ownerId: string
    qty: number
    rate:   number
    category:   Category,
    categoryId:  number
}

type removeProduct = {
    id:number,
    ownerId: string,
}


type Category = {
    id:number,
    name:string
    description: string | null
    products?:   Product[],
    stock?:       Stock
    ownerId: string
}

type removeCategory = {
    // id will become number
    id:number,
    ownerId: string,
}


type Stock = {
    id:number,
    name:string,
    description: string | null,
    category:   Category,
    categoryId: number
    ownerId: string
}

type removeStock = {
    id:number,
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


type ShopProduct = {
    id: number;
    name: string;
    price: number;
    description: string | null;
    qty: number;
    ownerId: string;
    category: ShopCategory,
}

type ShopCategory = {
    id: number;
    name: string;
    products:ShopProduct[] ;
}

type Rate = {
    productId: number;
    rating:float;
}