import { NextApiResponse, NextApiRequest } from "next";
import { addingToCartDB, deletingFromCartDB } from "../../../models/shop/cart/cartItemsModels";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { validationAddToCartItems, validationRemoveFromCartItems } from "../../../_lib_backend/validation/cartValidation";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";

export const addToCart = async (res: NextApiResponse, req: NextApiRequest) => {
  try {

    const tokenData = await decodeToken(req.headers.authorization);
    
        if (typeof tokenData !== "string") {
          return res
            .status(401)
            .json({ message: " Invalid token ", error: tokenData.error });
    }

    const data:CartItem = zodValidatorHelper(validationAddToCartItems,req.body,res);
    
    const add_to_cart = await addingToCartDB(data,tokenData);
    
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

    const tokenData = await decodeToken(req.headers.authorization);
    
        if (typeof tokenData !== "string") {
          return res
            .status(401)
            .json({ message: " Invalid token ", error: tokenData.error });
    }
    
    const data:RemoveCartItem = zodValidatorHelper(validationRemoveFromCartItems,req.body,res);

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

