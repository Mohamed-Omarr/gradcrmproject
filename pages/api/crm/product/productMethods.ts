import { NextApiRequest , NextApiResponse } from "next";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../../../../controllers/crm/product/productController";

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
export default async function  productHandler (req:NextApiRequest , res:NextApiResponse) {
    if (req.method === "POST") {
        return await createProduct(req,res)  
    }

    if (req.method === "DELETE") {
        return await deleteProduct(req,res)  
    }

    if (req.method === "PATCH") {
        return await updateProduct(req,res)  
    }


    if (req.method === "GET") {
        return await getProduct(req,res)  
    }
}