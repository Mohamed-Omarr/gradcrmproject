import "dotenv/config"
import jwt from "jsonwebtoken";
import { getAdminInfo } from "../../models/crm/auth/getAdminInfo";
import { getCustomerInfoDB } from "../../models/shop/auth/getCustomerInfoModel";

export const verifyToken = async (token:string,userType:string) => {
    try {
        if (!process.env.ACCESS_TOKEN_KEY) {
            throw new Error ("Missing Secret JWT");
        }
        
        const verifiedToken = jwt.verify(token,process.env.ACCESS_TOKEN_KEY) as {id:string};


        if (userType === "ADMIN") {
            const user = await getAdminInfo(verifiedToken.id);
        
            if (!user.success) {
                return {success:false,DBerror:user.error,status:404}
            }
            
            return {success:true,user:user.data}

        }else{
            const user = await getCustomerInfoDB(verifiedToken.id);
            if (!user.success) {
                return {success:false,DBerror:user.error,status:404}
            }
            return {success:true,user:user.data}
        }

    } catch(error){
        return {success:false,error:`processing failed verifying token: ${error}`}
    }
}