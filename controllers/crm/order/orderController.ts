import { NextApiResponse, NextApiRequest } from "next";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { ValidateUpdateOrderStatus } from "../../../_lib_backend/validation/orderValidation";
import {  getOrders, updatingOrderStatus } from "../../../models/crm/order/orderModels";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";

export const updateOrderStatus = async ( req: NextApiRequest , res: NextApiResponse) => {
  try {
    const data:UpdateOrderStatus = zodValidatorHelper(ValidateUpdateOrderStatus,req.body,res)
    
    const updatingStatusOfOrder = await updatingOrderStatus(data);

    if (updatingStatusOfOrder.success) {
      return res.status(200).json({
        message: "Updated Successfully",
        order:updatingStatusOfOrder.order
      });
    } else {
      return res.status(500).json({ error: updatingStatusOfOrder.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const getOrder = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
            const tokenData = await decodeToken(req.headers.authorization);

            if(typeof tokenData !== "string"){
                return res.status(401).json({message:" Invalid token ",error:tokenData.error})
            }
            // tokenData all include the ownerId and it being passed to function.
            
            const get_orders= await getOrders();

            if(get_orders.success){
                return res.status(200).json({message:" Fetched all orders successfully ",orders:get_orders.orders})
            } else {
                return res.status(500).json({error:get_orders.error})
            }

    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}
