import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../_lib_backend/prismaClient/PrismaClient";
import { stripe } from "../../../../../_lib_backend/stripe/backendStripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { amount, cardId } = req.body;

    // 1. Fetch the saved card details
    const savedCard = await prisma.savedCard.findUnique({
      where: { id: Number(cardId) },
      include:{
        customer:{
            select:{
                stripeCustomerId:true,
            }
        }
      },
    });

    if (!savedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    // 2. Create and confirm the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount:amount, // in cents (e.g., $20 = 2000)
      currency: "usd",
      customer: savedCard.customer.stripeCustomerId,
      payment_method: savedCard.stripePaymentMethodId,
      off_session: true,
      confirm: true,
    });

    return res.status(200).json({ success: true, paymentIntent });
  } catch (error: any) {
    if (error.code === "authentication_required") {
      return res.status(402).json({ error: "Card requires authentication", payment_intent: error.payment_intent });
    }

    return res.status(500).json({ error: error.message });
  }
}
