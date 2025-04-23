import {  NextApiResponse } from "next";
import { getCategories } from "../../../models/shop/category/categoryModels";

export const getCategory = async ( res:NextApiResponse) => {
    try {
            // Fetch all data
            const get_categories = await getCategories();

            if(get_categories.success){
                return res.status(200).json({message:" Fetched all categories successfully ",categories:get_categories.categories})
            } else {
                return res.status(400).json({error:get_categories.error})
            }

    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }
}