import ProductPick from "@/components/products/product-pick";
import ProductType from "@/components/products/product-type";
import FormatPrice from "@/lib/format-price";
import db from "@/server";
import { productVariants } from "@/server/schema";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (!data) {
    return [];
  }

  return data.map((variant) => ({
    params: { slug: variant.id.toString() },
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const productVariant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
              product: true,
            },
          },
        },
      },
    },
  });

  if (!productVariant) {
    return redirect("/404");
  }

  return (
    <main className="min-h-[calc(100dvh-100px)]">
      <section className="">
        <div className="flex-1">images</div>

        <div className="flex flex-col gap-2 flex-1">
          <p>{productVariant.product.title}</p>
          <div>
            <ProductType variants={productVariant.product.productVariants} />
          </div>
          <Separator className="h-[1px] bg-black/30" />
          <p className="text-2xl font-medium">
            {FormatPrice(productVariant.product.price)}
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: productVariant.product.description,
            }}
          ></div>
          <p className="text-secondary-foreground"> Available Colors</p>
          <div className="flex gap-2">
            {productVariant.product.productVariants.map((variant) => (
              <ProductPick
                key={variant.id}
                id={variant.id}
                color={variant.color}
                productType={variant.productType}
                title={variant.product.title}
                price={variant.product.price}
                productId={variant.productId}
                image={variant.variantImages[0].url}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
