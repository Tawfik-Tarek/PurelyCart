"use server";
import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const action = createSafeActionClient();

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

    await db.delete(productVariants).where(eq(productVariants.id, id));

    revalidatePath("/dashboard/products");
    return {
      success: {
        message: "Variant deleted successfully",
      },
    };
  });
