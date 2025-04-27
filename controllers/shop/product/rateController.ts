// import {  NextApiResponse } from "next";
// import { get_all_product, get_product_by_id } from "../../../models/shop/product/productModels";


// export const updateRateOfProduct = async ( res:NextApiResponse) => {
//         try {
//                     // get product from DB
//                     const update_rate = await update_rate();
        
//                     if(update_rate.success){
//                         return res.status(200).json({message:" Fetched all products successfully ",products:get_products.products})
//                     } else {
//                         return res.status(500).json({error:update_rate.error})
//                     }
//             } catch (error) {
//                 return res.status(500).json({error:`Internal Server Error:${error}`})
//             }
// }
