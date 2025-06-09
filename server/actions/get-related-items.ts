"use server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import db from "..";
import { eq, inArray, and, not } from "drizzle-orm";
import { variantTags, productVariants } from "../schema";

const action = createSafeActionClient();

export const getRelatedItems = action
  .schema(
    z.object({
      variantId: z.number(),
      limit: z.number().optional().default(4),
      offset: z.number().optional().default(0),
    })
  )
  .action(async ({ parsedInput }) => {
    const { variantId, limit, offset } = parsedInput;
    if (!variantId) {
      return {
        error: {
          message: "Variant ID is missing",
        },
      };
    }

    // First, get the current variant to know its productId
    const currentVariant = await db.query.productVariants.findFirst({
      where: eq(productVariants.id, variantId),
      columns: {
        productId: true,
      },
    });

    console.log("Current Variant:", currentVariant);
    

    if (!currentVariant) {
      return {
        error: {
          message: "Variant not found",
        },
      };
    }

    // Get tags for the current variant
    const tags = await db.query.variantTags.findMany({
      where: eq(variantTags.variantId, variantId),
    });

    if (!tags || tags.length === 0) {
      return {
        error: {
          message: "No tags found for this variant",
        },
      };
    }

    const relatedTags = tags.map((tag) => tag.tag);

    // Get distinct variant IDs that share any tag with the current variant
    const relatedVariantIdsQuery = await db.query.variantTags.findMany({
      where: and(
        inArray(variantTags.tag, relatedTags),
        not(eq(variantTags.variantId, variantId)) // Exclude the current variant
      ),
      columns: {
        variantId: true,
      },
    });

    const relatedVariantIds = [
      ...new Set(relatedVariantIdsQuery.map((item) => item.variantId)),
    ];

    if (relatedVariantIds.length === 0) {
      return {
        error: {
          message: "No related items found",
        },
      };
    }

    // Fetch the complete data for related variants, excluding same product
    const relatedProducts = await db.query.productVariants.findMany({
      where: and(
        inArray(productVariants.id, relatedVariantIds),
        not(eq(productVariants.productId, currentVariant.productId)) // Exclude same product variants
      ),
      with: {
        variantImages: true,
        variantTags: true,
        product: true,
      },
      limit,
      offset,
    });

    if (!relatedProducts || relatedProducts.length === 0) {
      return {
        error: {
          message: "No related items found",
        },
      };
    }

    return {
      success: {
        relatedProducts,
      },
    };
  });
