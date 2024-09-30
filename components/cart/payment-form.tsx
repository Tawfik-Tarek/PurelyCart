"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { redirect } from "next/dist/server/api-utils";

export default function PaymentForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }
    const { error } = await elements.submit();
    if (error) {
      setErrMessage(error.message as string);
      setIsLoading(false);
    }

    const data = await createPaymentIntent({
      amount: total*100,
      currency: "usd",
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        title: item.name,
        price: item.price,
        image: item.image,
        productId: item.id,
      })),
    });

    if (!data || data.data) {
      setErrMessage("Something went wrong");
      setIsLoading(false);
    }

    if (data?.data?.error) {
      setErrMessage(data.data.error.message);
      setIsLoading(false);
      return;
    }

    if (data?.data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.data.success.clientSecretId!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: data.data.success.user as string,
        },
      });
      if (error) {
        setErrMessage(error.message as string);
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        console.log("Payment Success");
      }
    }
  };

  return (
    <form onSubmit={handelSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button disabled={!stripe || !elements}>
        <span> Pay Now</span>
      </Button>
    </form>
  );
}
