"use server";

import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
const action = createSafeActionClient();

export const deleteProduct = action
  .schema(z.object({id : z.number()})  )
  .action(async ({ parsedInput: { id } }) => {
      
    if (!id) {
      return {
        error: {
          message: "Product ID is required",
        },
      };
    }

    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      return {
        error: {
          message: "Product not found",
        },
      };
    }

    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/dashboard/products");
    return {
      success: {
        message: `Product ${product.title} deleted successfully`,
      },
    };
  });
