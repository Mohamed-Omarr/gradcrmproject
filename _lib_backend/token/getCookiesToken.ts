"use server"
import { cookies } from "next/headers"

export const getCookiesToken = async () => {
    try {
        const data = await cookies();
        if (data && data.get("crm_token")?.value) {
            return data.get("crm_token")?.value;
        }
    } catch(error) {
        return `could not get token: ${error}`
    }
}