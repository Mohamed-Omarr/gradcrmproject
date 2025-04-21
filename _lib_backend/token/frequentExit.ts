"use server"
import { cookies } from "next/headers"
export const frequentExit = async () => {
    try {
        const data = await cookies();
        
        if (data && data.delete("crm_token")) {
            return data.get("crm_token");
        }
    } catch(error) {
        throw new Error(`could not get token: ${error}`);
    }
}