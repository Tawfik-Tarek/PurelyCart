"use server";
import { createSafeActionClient } from "next-safe-action";
import { VrientSchema as VariantSchema } from "@/types/vrient-schema";
import db from "..";
import { products, productVariants } from "../schema";
import { variantImages as VarientImages } from "../schema";
import { variantTags } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch"

type ImageType = z.infer<typeof VariantSchema.shape.variantImages>[number];
type TagType = z.infer<typeof VariantSchema.shape.tags>[number];


const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
)
const algoliaIndex = client.initIndex("products");

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

      const product = await db.query.products.findFirst({
        where: eq(products.id, existingVarient[0].productId),
      });

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

      if (product) {
        algoliaIndex.partialUpdateObject({
          objectID: existingVarient[0].id.toString(),
          id: existingVarient[0].productId,
          variantImages: variantImages[0].url,
          productType: productType,
        });
      }

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

      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });

      if (!product) {
        return {
          error: {
            message: "Product not found",
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

      if (product) {
        algoliaIndex.saveObject({
          objectID: newVariant[0].id.toString(),
          id: newVariant[0].productId,
          title: product.title,
          price: product.price,
          productType: newVariant[0].productType,
          variantImages: variantImages[0].url,
        });
      }

      revalidatePath("/dashboard/products");

      return {
        success: {
          message: "Variant added successfully",
        },
      };
    }
  });