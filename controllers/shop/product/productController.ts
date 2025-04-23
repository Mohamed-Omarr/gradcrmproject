import {  NextApiResponse } from "next";
import { get_all_product } from "../../../models/shop/product/productModels";


export const getProduct = async ( res:NextApiResponse) => {
        try {
        
                    // get product from DB
                    const get_products = await get_all_product();
        
                    if(get_products.success){
                        return res.status(200).json({message:" Fetched all products successfully ",products:get_products.products})
                    } else {
                        return res.status(500).json({error:get_products.error})
                    }
        
            } catch (error) {
                return res.status(500).json({error:`Internal Server Error:${error}`})
            }

}