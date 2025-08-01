import type { NextApiRequest, NextApiResponse } from "next";
import { frequentLogout, logoutUser } from "../../../../controllers/crm/auth/authController";

export default async function handleLogout(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST") {
    return await logoutUser(req, res); // Your regular logout
  }

  if (req.method === "GET") {
    return await frequentLogout(req,res); //middleware logout
  }

  return res.status(405).json({ error: "Method not allowed" });
}
