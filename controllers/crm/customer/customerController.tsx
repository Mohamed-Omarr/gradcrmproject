import { NextApiRequest , NextApiResponse } from "next";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import { getCustomers } from "../../../models/crm/customer/customerModels";

export const getCustomer = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
            const tokenData = await decodeToken(req.headers.authorization);

            if(typeof tokenData !== "string"){
                return res.status(401).json({message:" Invalid token ",error:tokenData.error})
            }
            
            const get_customers = await getCustomers();

            if(get_customers.success){
                return res.status(200).json({message:" Fetched all customers successfully ",customers:get_customers.customers})
            } else {
                return res.status(500).json({error:get_customers.error})
            }

    } catch (error) {
        return res.status(500).json({error:`Internal Server Error:${error}`})
    }

}