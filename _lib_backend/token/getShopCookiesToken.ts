"use server"
import { cookies } from "next/headers"

export const getShopCookiesToken = async () => {
    try {
        const data = await cookies();
        if (data && data.get("shop_token")?.value) {
            return data.get("shop_token")?.value;
        }
    } catch(error) {
        return `could not get token: ${error}`
    }
}