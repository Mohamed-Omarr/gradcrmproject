import axios from "axios";
import { getCookiesToken } from "../../_lib_backend/token/getCookiesToken";

export const attributesColors = async () =>  {
    try{
        const token = await getCookiesToken();
        const res = await axios.get("http://localhost:3000/api/crm/product/attributes/colorsMethods",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return res.data.colors;
    }catch(err){
        return `Failed to get colors info: ${err}`
    }

}