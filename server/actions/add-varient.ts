"use server";
import { createSafeActionClient } from "next-safe-action";
import { VrientSchema as VariantSchema } from "@/types/vrient-schema";
import db from "..";
import { productVariants } from "../schema";
import { variantImages as VarientImages } from "../schema";
import { variantTags } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
const action = createSafeActionClient();
type ImageType = z.infer<typeof VariantSchema.shape.variantImages>[number];
type TagType = z.infer<typeof VariantSchema.shape.tags>[number];

export const addVarient = action
  .schema(VariantSchema)
  .action(async ({ parsedInput: data }) => {
    const { color, id, productType, productId, editMode, variantImages, tags } =
      data;

    if (editMode && id) {
      const existingVarient = await db
        .update(productVariants)
        .set({
          color,
          productType,
          updated: new Date(),
        })
        .where(eq(productVariants.id, id))
        .returning();

      if (!existingVarient) {
        return {
          error: {
            message: "Variant not found",
          },
        };
      }

      await db
        .delete(variantTags)
        .where(eq(variantTags.variantId, existingVarient[0].id));

      await db.insert(variantTags).values(
        tags.map((tag: TagType) => ({
          tag,
          variantId: existingVarient[0].id,
        }))
      );

      await db
        .delete(VarientImages)
        .where(eq(VarientImages.variantId, existingVarient[0].id));

      await db.insert(VarientImages).values(
        variantImages.map((image: ImageType, index: number) => ({
          ...image,
          variantId: existingVarient[0].id,
          updated: new Date(),
          order: index,
        }))
      );

      revalidatePath("/dashboard/products");

      return {
        success: {
          message: "Variant updated successfully",
        },
      };
    } else {
      if (!productId) {
        return {
          error: {
            message: "Product not found",
          },
        };
      }

      if (!variantImages.length) {
        return {
          error: {
            message: "You must provide at least one image",
          },
        };
      }

      if (!tags.length) {
        return {
          error: {
            message: "You must provide at least one tag",
          },
        };
      }

      const newVariant = await db
        .insert(productVariants)
        .values({
          color,
          productType,
          productId,
          updated: new Date(),
        })
        .returning();

      if (!newVariant) {
        return {
          error: {
            message: "Failed to add variant",
          },
        };
      }

      await db.insert(variantTags).values(
        tags.map((tag: TagType) => ({
          tag,
          variantId: newVariant[0].id,
        }))
      );

      await db.insert(VarientImages).values(
        variantImages.map((image: ImageType, index: number) => ({
          ...image,
          variantId: newVariant[0].id,
          updated: new Date(),
          order: index,
        }))
      );

      revalidatePath("/dashboard/products");

      return {
        success: {
          message: "Variant added successfully",
        },
      };
    }
  });
