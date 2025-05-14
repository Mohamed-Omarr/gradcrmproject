import axios from "axios";
import { getCookiesToken } from "../../_lib_backend/token/getCookiesToken";
import { frequentExit } from "../../_lib_backend/token/frequentExit";

export const limitedAdminInfo = async () =>  {
    try{
        const token = await getCookiesToken();
        const res = await axios.get("http://localhost:3000/api/crm/auth/userInfo",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return res.data.user;
    }catch(err){
        await frequentExit();
        return `Failed to get admin info: ${err}`
    }

}