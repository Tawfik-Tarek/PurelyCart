"use client";
import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productId = Number(params.get("productId"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");



  return (
    <>
      <div className="flex gap-3 items-center justify-stretch my-4">
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
        >
          <Minus size={16} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={16} />
        </Button>
      </div>
      <Button
        onClick={() => {
            if (!id || !productId || !title || !type || !price || !image) {
                toast.error("Product not found");
                return redirect("/");
              }
          toast.success(`Added ${title + " " + type} to your cart!`);
          addToCart({
            id: productId,
            variant: { variantId: id, quantity },
            name: title + " " + type,
            price,
            image,
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
}
