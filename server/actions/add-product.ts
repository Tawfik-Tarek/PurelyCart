"use server";

import { createSafeActionClient } from "next-safe-action";
import { ProductSchema } from "@/types/product-schhema";
import db from "../index";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const addProduct = action
  .schema(ProductSchema)
  .action(async ({ parsedInput: data }) => {
    const { title, description, price, id } = data;

    // if product already exists, update it
    if (id) {
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
      await db
        .update(products)
        .set({
          title,
          description,
          price,
        })
        .where(eq(products.id, id));

      revalidatePath("/dashboard/products");
      return {
        success: {
          message: "Product updated successfully",
        },
      };
    }

    // create new product
    await db.insert(products).values({
      title,
      description,
      price,
    });

    revalidatePath("/dashboard/products");
    return {
      success: {
        message: "Product added successfully",
      },
    };
  });
