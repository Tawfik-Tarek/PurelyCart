"use client";
import { useCartStore } from "@/lib/client-store";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import PaymentForm from "./payment-form";

export default function Payment() {
  const stripe = getStripe();
  const cart = useCartStore((state) => state.cart);
  const total = cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0);
  
  return (
    <motion.div>
      <Elements
        stripe={stripe}
        options={{ mode: "payment", currency: "usd", amount: total*100 }}
      >
        <PaymentForm total={total} />
      </Elements>
    </motion.div>
  );
}
