"use server";

import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const action = createSafeActionClient();

export const getProduct = action
  .schema(z.object({ id: z.number() }))
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

    return {
      success: {
        message: `Product ${product.title} found successfully`,
        product,
      },
    };
  });
