"use server"
import { cookies } from "next/headers"
export const frequentExit = async () => {
    try {
        const cookieStore = cookies();
        const token =  (await cookieStore).get("crm_token");

        if (token) {
            (await cookieStore).delete("crm_token");
            return token;
        }

        return null;
    } catch (error) {
        throw new Error(`Could not get token: ${error}`);
    }
}