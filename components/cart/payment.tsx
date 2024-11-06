"use client";
import { useCartStore } from "@/lib/client-store";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { useTheme } from "next-themes";
import PaymentSkeleton from "./patment-skeleton";

const PaymentForm = lazy(() => import("./payment-form"));

export default function Payment() {
  const stripe = getStripe();
  const cart = useCartStore((state) => state.cart);
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.variant.quantity,
    0
  );
  const { theme } = useTheme();
  const formattedTotal = Number(total.toFixed(2));
  const amountInSubunits = Math.round(formattedTotal * 100);

  return (
    <motion.div className="lg:px-20">
      <Elements

        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: amountInSubunits,
          appearance: {
            theme: theme === "dark" ? "night" : "flat",
          },
        }}
      >
        <Suspense fallback={<PaymentSkeleton />}>
          <PaymentForm total={formattedTotal} />
        </Suspense>
      </Elements>
    </motion.div>
  );
}