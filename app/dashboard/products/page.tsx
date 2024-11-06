import db from "@/server/index";
import placeholder from '@/public/placeholder_small.jpg'
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Products() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return redirect("/");
  }
  const products = await db.query.products.findMany({
    with:{
      productVariants:{
        with:{variantImages:true,variantTags:true}
      }
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) {
    return <div>No products found</div>;
  }

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      variants: product.productVariants,
      image : product.productVariants[0]?.variantImages[0]?.url || placeholder.src,
    };
  });

  return (
    <div>
     <DataTable columns={columns} data={dataTable}/>
    </div>
  );
}
