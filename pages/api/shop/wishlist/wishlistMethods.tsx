import { NextApiRequest, NextApiResponse } from "next";
import {  addToWishlistItems, deleteWishlist, getWishlist } from "../../../../controllers/shop/wishlist/wishlistController";

export default async function wishlistHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return await addToWishlistItems(req, res);
  }

  if (req.method === "DELETE") {
    return await deleteWishlist(req, res);
  }

  if (req.method === "GET") {
    return await getWishlist(req, res);
  }
  
  return res.status(405).json({ message: "Method Not Allowed" });
}
