"use client";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown, MoreHorizontalIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import ProductVarient from "./product-varient";

type ProductColumn = {
  id: number;
  title: string;
  description: string;
  price: number;
  variants: VariantsWithImagesTags[];
  image: string;
};

const ActionCell = ({ row }: { row: any }) => {
  const { execute, status } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.dismiss();
        toast.success(data.success.message);
      } else if (data?.error) {
        toast.dismiss();
        toast.error(data.error.message);
      }
    },
    onExecute: () => {
      toast.loading("Deleting product...");
    },
  });

  function handelDeleteProduct(id: number) {
    execute({ id });
  }

  const product = row.original;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:outline-none cursor-pointer"
      >
        <MoreHorizontalIcon size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className="focus-visible:ring-0 ">
          <Button
            asChild
            variant="ghost"
            className="bg-primary/80 dark:bg-primary w-full cursor-pointer focus-visible:opacity-90"
            size="sm"
            disabled={status === "executing"}
          >
            <Link href={`/dashboard/add-product?id=${product.id}`}>Edit</Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="focus-visible:ring-0">
          <Button
            variant="ghost"
            className="bg-destructive/80 dark:bg-destructive w-full cursor-pointer focus-visible:opacity-90"
            size="sm"
            disabled={status === "executing"}
            onClick={() => handelDeleteProduct(product.id)}
          >
            Delete
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];

      return (
        <div className="font-medium text-xs flex gap-2">
          {variants.length > 0 &&
            variants.map((variant, index) => {
              return (
                <div key={variant.id} className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ProductVarient
                          productId={variant.productId}
                          editMode={true}
                          variant={variant}
                        >
                          <div
                            className="w-5 h-5 rounded-full"
                            key={variant.id}
                            style={{ backgroundColor: variant.color }}
                          />
                        </ProductVarient>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{variant.productType}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
            })}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ProductVarient editMode={false} productId={row.original.id}>
                  <PlusCircle className="h-6 w-6 cursor-pointer text-primary" />
                </ProductVarient>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const price = row.getValue();
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price as number);
      return <div className="font-medium text-xs">{formattedPrice}</div>;
    },
  },

  {
    accessorKey: "image",
    header: "Image",
    cell: (row) => {
      const image = row.getValue();
      return (
        <div className="flex items-center">
          <Image
            src={image as string}
            width={50}
            height={50}
            alt="productImage"
            className="w-[50px] h-[50px] object-cover rounded-md"
          />
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionCell row={row} />;
    },
  },
];
