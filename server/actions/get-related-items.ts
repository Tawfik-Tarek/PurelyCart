"use server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import db from "..";
import { eq, inArray } from "drizzle-orm";
import { variantTags } from "../schema";

const action = createSafeActionClient();

export const getRelatedItems = action
  .schema(z.object({ variantId: z.number() }))
  .action(async ({ parsedInput }) => {
    const { variantId } = parsedInput;
    if (!variantId) {
      return {
        error: {
          message: "Variant ID is missing",
        },
      };
    }

    // Fetch tags related to the given variant
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

    // Extract all the tag names
    const relatedTags = tags.map((tag) => tag.tag);

    // Find related items by all tags, excluding the current variant
    const relatedItems = await db.query.variantTags.findMany({
      where: inArray(variantTags.tag, relatedTags),
    });

    if (!relatedItems || relatedItems.length === 0) {
      return {
        error: {
          message: "No related items found",
        },
      };
    }

    const relatedItemIds = relatedItems
      .map((item) => item.variantId)
      .filter((id) => id !== variantId);

    if (relatedItemIds.length === 0) {
      return {
        error: {
          message: "No related items found",
        },
      };
    }

    const uniqueRelatedItemIds = [...new Set(relatedItemIds)];

    return {
      success: {
        relatedItemIds: uniqueRelatedItemIds,
      },
    };
  });
