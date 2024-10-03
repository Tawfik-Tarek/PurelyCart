"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/client-store";
import Lottie from "lottie-react";
import orderConfirmedAnimation from "@/public/order-conifrmed.json";

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="text-primary text-sm sm:text-lg md:text-2xl font-semibold">
        Thank You for your purchase💙
      </h1>
      <Lottie
        animationData={orderConfirmedAnimation}
        className="w-48 sm:w-80 md:w-96 md:h-72"
      />
      <Link href="/dashboard/orders" aria-label="view orders">
        <Button
          onClick={() => {
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
        >
          View Orders
        </Button>
      </Link>
    </div>
  );
}
