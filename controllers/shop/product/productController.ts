import {  NextApiResponse } from "next";
import { get_all_product, get_product_by_id, get_products_by_category } from "../../../models/shop/product/productModels";


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

export const getProductById = async ( res:NextApiResponse,queryValue:string) => {
    try {
                const get_products = await get_product_by_id(queryValue);
    
                if(get_products.success){
                    return res.status(200).json({message:" Fetched all products successfully ",product:get_products.product})
                } else {
                    return res.status(500).json({error:get_products.error})
                }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}

export const getRelatedProductsByCategory = async ( res:NextApiResponse,queryValue:string) => {
    try {
                const get_products = await get_products_by_category(queryValue);
    
                if(get_products.success){
                    return res.status(200).json({message:" Fetched all products successfully ",products:get_products.products})
                } else {
                    return res.status(500).json({error:get_products.error})
                }
        } catch (error) {
            return res.status(500).json({error:`Internal Server Error:${error}`})
        }
}