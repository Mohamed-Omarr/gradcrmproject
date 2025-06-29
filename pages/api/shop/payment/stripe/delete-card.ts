import prisma from "../../../../../_lib_backend/prismaClient/PrismaClient";
import { stripe } from "../../../../../_lib_backend/stripe/backendStripe";
import { NextApiRequest , NextApiResponse } from "next";
import { decodeToken } from "../../../../../_lib_backend/token/decodeToken";


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end("Method Not Allowed");

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

    const card = await prisma.savedCard.findUnique({
      where: { id: Number(cardId) },
    });

    if (!card || card.customerId !== customer.id)
      return res.status(403).json({ error: "Unauthorized or card not found" });

    const wasDefault = card.isDefault;

    // 1. Detach from Stripe
    await stripe.paymentMethods.detach(card.stripePaymentMethodId);

    // 2. Delete from local DB
    await prisma.savedCard.delete({
      where: { id: Number(cardId) },
    });

    // 3. If deleted card was default, promote another one
    if (wasDefault) {
      const anotherCard = await prisma.savedCard.findFirst({
        where: { customerId: customer.id },
        orderBy: { createdAt: "asc" }, 
      });

      if (anotherCard) {
        await prisma.savedCard.update({
          where: { id: Number(anotherCard.id) },
          data: { isDefault: true },
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
