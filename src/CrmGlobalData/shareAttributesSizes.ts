import axios from "axios";
import { getCookiesToken } from "../../_lib_backend/token/getCookiesToken";

export const attributesSizes = async () =>  {
    try{
        const token = await getCookiesToken();
        const res = await axios.get("http://localhost:3000/api/crm/product/attributes/sizesMethods",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return res.data.sizes;
    }catch(err){
        return `Failed to get sizes info: ${err}`
    }

}