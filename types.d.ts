type Product = {
    id:number
    name:string
    price: float
    description: string | undefined
    thumbnail: string
    images: ProductImages[]
    ownerId: string
    qty: number
    ratings:   Rate[]
    category:   Category,
    categoryId:  number,
    colors: Colors[],
    sizes: Sizes[],
}

type ProductImages = {
    id:number,
    url:      string,
    productId: number,
}

type removeProduct = {
    id:number,
    ownerId: string,
}


type Category = {
    id:number,
    name:string
    description: string | undefined
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
    description: string | undefined,
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

type customerData = {
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
    description: string | undefined;
    qty: number;
    ownerId: string;
    category: ShopCategory,
    thumbnail: string
    colors:Colors[],
    sizes:Sizes[],
    ratings:   Rate[]
    wishlist:    WishlistItems[],
    isWishListed:   boolean
}

type ShopCategory = {
    id: number;
    name: string;
    products:ShopProduct[] ;
}

type Rate = {
    id:number
    productId: number;
    score:number;
    review:  string
    customerId:string
    customer:   customerData
    createdAt:    string 
    updatedAt:    string 
}

type removeRate = {
    id:number
    productId: number;
    customerId:string
}

type Sizes = {
    id:number
    code:string
    name:string
    Products:   Product[],  
}

type removeSizes = {
    id:number
    ownerId: string
}

type Colors = {
    id:number
    code:string
    name:string
    ownerId:string,
    Products:   Product[],  
}

type removeColors = {
    id:number
    ownerId:string
}

type SizeOfProduct = {
    sizeIds:number[],
    productId:number
}

type ColorOfProduct = {
    colorIds:number[],
    productId:number
}


type WishlistItems = {
    product:   ShopProduct[]
    productId:  number,
    customerId: string,
}

type DeleteWishlistItems = {
    id:number,
    productId:  number,
    customerId: string,
}

type Address = {
    id: number
    customerId:  string,
    addressType:  string,
    street:  string,
    city:  string,
    country:  string,
    default:  boolean,
    zipCode:    number,
}

type DeleteAddress = {
    id: number
    customerId:  string,
}

type setToDefaultAddress = {
    id: number
    customerId:  string,
    default:  boolean,
    previousDefaultAddressId:  number,
}