"use server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import db from "..";
import { eq, inArray } from "drizzle-orm";
import { variantTags } from "../schema";

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

    const relatedItems = await db.query.variantTags.findMany({
      where: inArray(variantTags.tag, relatedTags),
      limit,
      offset,
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
