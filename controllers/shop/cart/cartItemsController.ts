import { NextApiResponse, NextApiRequest } from "next";
import { addingToCartDB, deletingFromCartDB, updatingCartItemDB } from "../../../models/shop/cart/cartItemsModels";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { validationAddToCartItems, validationRemoveFromCartItems, validationUpdateCartItems } from "../../../_lib_backend/validation/cartValidation";
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


export const updateCartItem = async (res: NextApiResponse, req: NextApiRequest) => {
  try {

    const data:CartItem = zodValidatorHelper(validationUpdateCartItems,req.body,res);
    
    const update_cart_item = await updatingCartItemDB(data);
    
    if (update_cart_item.success) {
      return res.status(200).json({ message: "updated" });
    } else {
      return res.status(500).json({ error: update_cart_item.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const deleteFromCart = async (res: NextApiResponse, req: NextApiRequest) => {
  try {

    const data:RemoveCartItem = zodValidatorHelper(validationRemoveFromCartItems,req.body,res);

    const delete_from_cart = await deletingFromCartDB(data);

    if (delete_from_cart.success) {
      return res.status(200).json({ message: "deleted" });
    } else {
      return res.status(500).json({ error: delete_from_cart.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

