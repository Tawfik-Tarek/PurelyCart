"use client";

import { useEffect, useState } from "react";
import { getRelatedItems } from "@/server/actions/get-related-items";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import FormatPrice from "@/lib/format-price";
import { VariantsWithProduct } from "@/lib/infer-type";

export default function RelatedProducts({ variantId }: { variantId: number }) {
  const [relatedProducts, setRelatedProducts] = useState<VariantsWithProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true);
        const response = await getRelatedItems({
          variantId,
          limit: 4,
        });

        if (response?.data?.success) {
          setRelatedProducts(response.data.success.relatedProducts);
        } else if (response?.data?.error) {
          setError(response.data.error.message);
        }
      } catch (err) {
        setError("Failed to load related products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (variantId) {
      fetchRelatedProducts();
    }
  }, [variantId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
            >
              <div className="bg-gray-300 rounded-md h-48 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((variant) => (
          <Link
            key={variant.id}
            href={`/products/${variant.id}?id=${variant.id}&productId=${variant.productId}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0]?.url}`}
            className="group"
          >
            <div className="overflow-hidden rounded-md">
              <Image
                className="rounded-md pb-2 transition-transform group-hover:scale-105 duration-300"
                src={variant.variantImages[0]?.url || "/placeholder.jpg"}
                loading="lazy"
                width={400}
                height={300}
                alt={`${variant.product.title} ${variant.productType}`}
              />
            </div>

            <div className="flex justify-between mt-2">
              <div className="font-medium">
                <h3>{variant.product.title}</h3>
                <p className="text-sm text-black dark:text-white">
                  {variant.productType}
                </p>
              </div>
              <div>
                <Badge variant={"secondary"}>
                  {FormatPrice(variant.product.price)}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
