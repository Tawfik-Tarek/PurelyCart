"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import FormatPrice from "@/lib/format-price";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export function Products({ variants }: ProductTypes) {
  const params = useSearchParams()
  const paramTag = params.get("tag")

  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      )
    }
    return variants
  }, [paramTag , variants])

  return (
    <main className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-10  place-items-end ">
      {filtered.map((variant) => (
        <Link
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productId=${variant.productId}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            className="rounded-md pb-2"
            src={variant.variantImages[0].url}
            loading="lazy"
            width={720}
            height={480}
            alt={`${variant.product.title} ${variant.productType}`}
          />

          <div className="flex justify-between ">
            <div className="font-medium">
              <h1>{variant.product.title}</h1>
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
    </main>
  );
}
