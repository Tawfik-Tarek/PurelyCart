import { Products } from "@/components/products/products";
import db from "@/server";

export default async function Example() {
  const data = await db.query.productVariants.findMany(
    {
      with:{
        variantImages:true,
        variantTags:true,
        product:true
      },
      orderBy:(productVariants , {desc}) => [desc(productVariants.id)]
    }
  )
  return (
    <div className="min-h-[calc(100dvh-100px)]">
      <Products variants={data}/>
    </div>
  )
}
