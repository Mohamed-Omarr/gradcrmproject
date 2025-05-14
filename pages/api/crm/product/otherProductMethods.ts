import { NextApiRequest , NextApiResponse } from "next";
import { createProduct , updateProduct } from "../../../../controllers/crm/product/productController";

// these Two Method Needs bodyParse to be false so then the controller can handle the data as required
export const config = {
    api: {
      bodyParser: false,
    },
};
  
export default async function  productHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createProduct(req,res)  
    }

    if (req.method === "PATCH") {
            return await updateProduct(req,res)  
    }
    
    return res.status(405).json({error:"Method Not Allowed"});
}