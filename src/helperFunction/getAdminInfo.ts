// lib/getAdminInfo.ts

import { getCookiesToken } from "../../_lib_backend/token/getCookiesToken";

export async function limitedAdminInfo() {
  const token = await getCookiesToken();

  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/crm/auth/adminInfo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch admin info: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.user;
}
