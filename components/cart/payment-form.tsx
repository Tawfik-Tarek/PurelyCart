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
import { useAction } from "next-safe-action/hooks";
import { CreateOrder } from "@/server/actions/create-order";
import { toast } from "sonner";

export default function PaymentForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress ,  } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const { execute, status } = useAction(CreateOrder, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setIsLoading(false);
        toast.success(data.success.message);
        setCheckoutProgress("confirmation-page");
        
      } else if (data?.error) {
        toast.error(data.error.message);
      }
    },
  });

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
      amount: total * 100,
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
        execute({
          total,
          products: cart.map((item) => ({
            productId: item.id,
            quantity: item.variant.quantity,
            variantId: item.variant.variantId,
          })),
          status: "pending",
        });
      }
    }
  };

  return (
    <form onSubmit={handelSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        disabled={!stripe || !elements}
        aria-label="pay now"
        className="mt-3 w-full max-w-md mx-auto"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
