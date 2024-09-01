import db from "@/server/index";
import placeholder from '@/public/placeholder_small.jpg'
import { DataTable } from "./data-table";
import { columns } from "./columns";



export default async function Products() {
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
      variants: [] ,
      image : placeholder.src
    };
  });

  return (
    <div>
     <DataTable columns={columns} data={dataTable}/>
    </div>
  );
}
