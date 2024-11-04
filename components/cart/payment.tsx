"use client";
import { useCartStore } from "@/lib/client-store";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import PaymentForm from "./payment-form";
import { useTheme } from "next-themes";

export default function Payment() {
  const stripe = getStripe();
  const cart = useCartStore((state) => state.cart);
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.variant.quantity,
    0
  );
  const {theme} = useTheme()
  const formattedTotal = Number(total.toFixed(2));
  const amountInSubunits = Math.round(formattedTotal * 100);

  console.log("amountInSubunits", amountInSubunits);
  


  return (
    <motion.div className="lg:px-20">
      <Elements
        stripe={stripe}
        options={{
          mode: "payment", currency: "usd", amount: Number(amountInSubunits), appearance: {
          theme: theme === "dark" ? "night" : "flat"
        }}}
      >
        <PaymentForm total={formattedTotal} />
      </Elements>
    </motion.div>
  );
}
