import axios from "axios";
import { getCookiesToken } from "../../_lib_backend/token/getCookiesToken";

export const limitedAdminInfo = async () =>  {
    try{
        const token = await  getCookiesToken();
        
        const res = await axios.get("/api/crm/auth/userInfo",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return res.data.user;
    }catch(err){
        return `Failed to get admin info: ${err}`
    }

}