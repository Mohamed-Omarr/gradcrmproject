import type { NextApiRequest, NextApiResponse } from "next";
import { customer_logout, frequentLogout } from "../../../../controllers/shop/auth/CustomerAuthController";

export default async function handleLogout(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST") {
    return await customer_logout(req, res); // Your regular logout
  }

  if (req.method === "GET") {
    return await frequentLogout(req,res); //middleware logout
  }

  return res.status(405).json({ error: "Method not allowed" });
}
