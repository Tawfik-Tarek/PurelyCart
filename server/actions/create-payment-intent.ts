"use server";

import { PaymentIntentSchema } from "@/types/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import Stripe from "stripe";
import { auth } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const action = createSafeActionClient();

export const createPaymentIntent = action
  .schema(PaymentIntentSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await auth();
    if (!user) {
      return {
        error: {
          message: "You need to be logged in to perform this action",
        },
      };
    }
    const { amount, currency, cart } = data;
    if (cart.length === 0) {
      return {
        error: {
          message: "Cart is empty",
        },
      };
    }

    if (!amount || !currency) {
      return {
        error: {
          message: "Amount or currency is missing",
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        cart: JSON.stringify(cart),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      success: {
        paymentIntentId: paymentIntent.id,
        clientSecretId: paymentIntent.client_secret,
        user: user.user.email,
      },
    };
  });
