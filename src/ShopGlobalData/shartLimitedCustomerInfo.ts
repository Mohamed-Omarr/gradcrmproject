import axios from "axios";
import { shopFrequentExit } from "../../_lib_backend/token/shopFrequentExit";
import { getShopCookiesToken } from "../../_lib_backend/token/getShopCookiesToken";

export const limitedCustomerInfo = async () =>  {
    try{
        
        const token = await getShopCookiesToken();
        const res = await axios.get("http://localhost:3000/api/shop/auth/customerInfo",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return res.data.user;
    }catch(err){
        await shopFrequentExit();
        return `Failed to get customer info: ${err}`
    }

}