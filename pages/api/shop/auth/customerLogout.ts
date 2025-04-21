import type { NextApiRequest, NextApiResponse } from "next";
import { frequentLogout } from "../../../../controllers/crm/auth/authController";
import { customer_logout } from "../../../../controllers/shop/auth/authControllerCustomer";

export default async function handleLogout(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST") {
    return await customer_logout(req, res); // Your regular logout
  }

  if (req.method === "GET") {
    return await frequentLogout(req,res); //middleware logout
  }

  return res.status(405).json({ error: "Method not allowed" });
}
