import { NextApiRequest , NextApiResponse } from "next";
import { createCard, deleteCard, getCard, updateCard } from "../../../../../controllers/shop/payment/card/cardController";

export default async function  cardHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createCard(res,req)  
    }

    if (req.method === "DELETE") {
        return await deleteCard(res,req)  
    }

    if (req.method === "PATCH") {
        return await updateCard(res,req)  
    }

    if (req.method === "GET") {
        return await getCard(res,req)  
    }

    return res.status(405).json({message:"Method Not Allowed"})
}