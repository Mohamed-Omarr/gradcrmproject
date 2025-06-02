"use server"
import { cookies } from "next/headers"
export const shopFrequentExit = async () => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("shop_token");

        if (token) {
            (await cookieStore).delete("shop_token");
            return token;
        }

        return null;
    } catch (error) {
        throw new Error(`Could not get token: ${error}`);
    }
}