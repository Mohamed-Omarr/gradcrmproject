import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!stripePublicKey){
        throw new Error("STRIPE_PUBLIC_KEY not provided")
    }

  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }

  return stripePromise;
};
