import { NextApiRequest, NextApiResponse } from "next";
import {
  getRelatedProductsByCategory,
} from "../../../../controllers/shop/product/productController";

export default async function relatedProductsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (req.query.categoryId) {
      return await getRelatedProductsByCategory(res, req.query.categoryId as string);
    } else{
        return res.status(400).json({ message: "Missing Url Query" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
