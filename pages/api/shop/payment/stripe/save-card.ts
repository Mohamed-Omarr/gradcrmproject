import prisma from "../../../../../_lib_backend/prismaClient/PrismaClient";
import { stripe } from "../../../../../_lib_backend/stripe/backendStripe";
import { NextApiRequest , NextApiResponse } from "next";
import { decodeToken } from "../../../../../_lib_backend/token/decodeToken";

export default async function handler(req:NextApiRequest , res:NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
        const tokenDataId = await decodeToken(req.headers.authorization);
    
        if (typeof tokenDataId !== "string") {
          return res
            .status(401)
            .json({ message: " Invalid token ", error: tokenDataId.error });
        }

        const { paymentMethodId  } = req.body;

    // Normally you'd get this from session or token
    const customer = await prisma.customer.findUnique({
      where: { id: tokenDataId } ,
      select:{
        id:true,
        name:true,
        email:true,
        stripeCustomerId:true,
      }
    });

    if (!customer) return res.status(400).json({ error: "Customer not found" });

    // Create Stripe customer if not already created
    let stripeCustomerId = customer.stripeCustomerId;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.name,
      });

      stripeCustomerId = stripeCustomer.id;

      await prisma.customer.update({
        where: { id: customer.id },
        data: { stripeCustomerId:stripeCustomerId },
      });
    }

    // 1. Attach the PaymentMethod to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // 2. Retrieve the PaymentMethod to extract card info
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    const card = paymentMethod.card;

    if (!card){
      return res.status(400).json({ error: "card info is undefined" }); 
    }

    // 3. Check if this is the user's first card
    const existingCards = await prisma.savedCard.findMany({
      where: { customerId: customer.id },
    });

    const isFirstCard = existingCards.length === 0;

    // 4. Save to local DB
    const saved = await prisma.savedCard.create({
      data: {
        customerId: customer.id,
        stripePaymentMethodId: paymentMethodId,
        brand: card.brand,
        last4: card.last4,
        holderName: paymentMethod.billing_details.name || "",
        expiryMonth: card.exp_month,
        expiryYear: card.exp_year,
        isDefault: isFirstCard, // only true if it's the first card
      },
    });

    return res.status(201).json({ savedCardId: saved.id });
  } catch (err) {
    return res.status(500).json({ error: `Server Error, ${err}` });
  }
}
