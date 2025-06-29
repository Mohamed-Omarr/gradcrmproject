import prisma from "../../../../../_lib_backend/prismaClient/PrismaClient";
import { decodeToken } from "../../../../../_lib_backend/token/decodeToken";
import { NextApiRequest , NextApiResponse } from "next";

export default async function handler(req:NextApiRequest , res:NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { cardId } = req.body;
    const tokenDataId = await decodeToken(req.headers.authorization);
            
                if (typeof tokenDataId !== "string") {
                  return res
                    .status(401)
                    .json({ message: " Invalid token ", error: tokenDataId.error });
                }

    const customer = await prisma.customer.findUnique({
      where: { id: tokenDataId },
    });

    if (!customer) return res.status(400).json({ error: "Customer not found" });

    const targetCard = await prisma.savedCard.findUnique({
      where: { id: Number(cardId) },
    });

    if (!targetCard || targetCard.customerId !== customer.id)
      return res.status(403).json({ error: "Unauthorized or card not found" });

    // 1. Unset all other cards
    await prisma.savedCard.updateMany({
      where: { customerId: customer.id },
      data: { isDefault: false },
    });

    // 2. Set this one as default
    await prisma.savedCard.update({
      where: { id: Number(cardId) },
      data: { isDefault: true },
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: `Internal server error: ${err}` });
  }
}
