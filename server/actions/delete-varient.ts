"use server";
import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import algoliasearch from "algoliasearch";

const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);
const algoliaIndex = client.initIndex("products");

export const deleteVarient = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    if (!id) {
      return {
        error: {
          message: "Id is required",
        },
      };
    }

    const deletedVarient = await db
      .delete(productVariants)
      .where(eq(productVariants.id, id))
      .returning();

      algoliaIndex.deleteObject(deletedVarient[0].id.toString());

    revalidatePath("/dashboard/products");
    return {
      success: {
        message: "Variant deleted successfully",
      },
    };
  });
