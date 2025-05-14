import { NextApiRequest, NextApiResponse } from "next";
import {
  getProductById,
} from "../../../../controllers/shop/product/productController";

export default async function singleProductHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (req.query.Id) {
      return await getProductById(res, req.query.Id as string);
    } else{
        return res.status(400).json({ message: "Missing Url Query" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
