import { NextApiResponse, NextApiRequest } from "next";
import { zodValidatorHelper } from "../../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { decodeToken } from "../../../../_lib_backend/token/decodeToken";
import { ValidateCreateOrder } from "../../../../_lib_backend/validation/orderValidation";
import { addingOrder, gettingOrder } from "../../../../models/shop/payment/order/orderModels";

export const createOrder = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    
    const data:CreateOrderPayload = zodValidatorHelper(ValidateCreateOrder,req.body,res)
    
    const creatingOrder= await addingOrder(data);

    if (creatingOrder.success) {
      return res.status(201).json({
        message: "Created Successfully",
      });
    } else {
      return res.status(500).json({ error: creatingOrder.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const getOrder = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const tokenData = await decodeToken(req.headers.authorization);

    if (typeof tokenData !== "string") {
      return res
        .status(401)
        .json({ message: " Invalid token ", error: tokenData.error });
    }

    const gettingTheOrder = await gettingOrder(tokenData);

    if (gettingTheOrder.success) {
      return res.status(200).json({
        allOrders:gettingTheOrder.orders
      });
    } else {
      return res.status(500).json({ error: gettingTheOrder.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};
