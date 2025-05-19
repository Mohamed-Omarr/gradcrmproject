import { NextApiRequest , NextApiResponse } from "next";
import { createAddress, deleteAddress, getAddress, updateAddress } from "../../../../controllers/shop/address/addressController";

export default async function  addressHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createAddress(res,req)  
    }

    if (req.method === "DELETE") {
        return await deleteAddress(res,req)  
    }

    if (req.method === "PATCH") {
        return await updateAddress(res,req)  
    }

    if (req.method === "GET") {
        return await getAddress(res,req)  
    }

    return res.status(405).json({message:"Method Not Allowed"})
}