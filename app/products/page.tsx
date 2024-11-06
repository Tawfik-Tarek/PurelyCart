import { Products } from "@/components/products/products";
import db from "@/server";
import { Metadata } from "next";

export const revalidate = 60 * 60;

export default async function ProductsPage() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  return (
    <div className="min-h-[calc(100dvh-100px)]">
      <Products variants={data} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "PurelyCart",
  description: "List of all products",
};