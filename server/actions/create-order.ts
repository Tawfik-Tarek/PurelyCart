"use server";

import { orderSchema } from "@/types/order";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import db from "..";
import { orderProduct, orders } from "../schema";
import { z } from "zod";

const action = createSafeActionClient();

type OrderInput = z.infer<typeof orderSchema>;

export const CreateOrder = action
  .schema(orderSchema)
  .action(async ({ parsedInput: data }) => {
    const { total, products, status, paymentIntentId} = data as OrderInput; // Cast data to OrderInput
    if (!total || !products || !status) {
      return {
        error: {
          message: "Please provide all required fields",
        },
      };
    }

    const user = await auth();
    if (!user) {
      return {
        error: {
          message: "You must be logged in to create an order",
        },
      };
    }

    const order = await db
      .insert(orders)
      .values({
        userId: user.user.id,
        status,
        total,
        paymentIntentId,
      })
      .returning();

    const orderProducts = await Promise.all(
      products.map(async (product: OrderInput["products"][number]) => {
        const { productId, quantity, variantId } = product;
        return await db
          .insert(orderProduct)
          .values({
            orderId: order[0].id,
            productId,
            quantity,
            productVariantId: variantId,
          })
          .returning();
      })
    );

    return {
      success: {
        message: "Order created successfully",
        order: order[0],
        orderProducts,
      },
    };
  });
