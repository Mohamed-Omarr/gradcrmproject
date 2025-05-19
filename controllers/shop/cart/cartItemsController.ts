import { NextApiResponse, NextApiRequest } from "next";
import { addingToCartDB, deletingFromCartDB } from "../../../models/shop/cart/cartItemsModels";

export const addToCart = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const data = req.body;
    const add_to_cart = await addingToCartDB(data);
    if (add_to_cart.success) {
      return res.status(200).json({
        message: " Added to cart successfully",
      });
    } else {
      return res.status(500).json({ error: add_to_cart.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const deleteFromCart = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const data = req.body;
    const delete_to_cart = await deletingFromCartDB(data);
    if (delete_to_cart.success) {
      return res.status(204).json({
        message: " Removed successfully",
      });
    } else {
      return res.status(500).json({ error: delete_to_cart.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

