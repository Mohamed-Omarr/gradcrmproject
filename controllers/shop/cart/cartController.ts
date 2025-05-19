import { NextApiResponse, NextApiRequest } from "next";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import { getCartDB } from "../../../models/shop/cart/cartModels";

export const getCart = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const tokenData = await decodeToken(req.headers.authorization);

    if (typeof tokenData !== "string") {
      return res
        .status(401)
        .json({ message: " Invalid token ", error: tokenData.error });
    }

    const get_cart = await getCartDB(tokenData);

    if (get_cart.success) {
      return res.status(200).json({
        message: " Fetched Cart successfully ",
        cart: get_cart.cart,
      });
    } else {
      return res.status(500).json({ error: get_cart.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};
