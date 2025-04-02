"use server";

import { reviewsSchema } from "@/types/reviews-schema";
import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { reviews, orders, orderProduct } from "../schema";
import { auth } from "../auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const addReview = action
  .schema(reviewsSchema)
  .action(async ({ parsedInput: data }) => {
    const session = await auth();
    if (!session) {
      return {
        error: {
          message: "You must be logged in to add a review",
        },
      };
    }

    const { rating, comment, productId } = data;
    if (!rating || !comment) {
      throw new Error("Rating and comment are required");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (comment.length < 4 || comment.length > 255) {
      throw new Error("Comment must be between 4 and 255 characters");
    }

    // Check if user has purchased this product
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      with: {
        orderProduct: {
          where: eq(orderProduct.productId, productId),
        },
      },
    });

    const hasPurchased = userOrders.some(
      (order) => order.orderProduct.length > 0
    );

    if (!hasPurchased) {
      return {
        error: {
          message: "You can only review products you've purchased",
        },
      };
    }

    const existedReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.userId, session.user.id),
        eq(reviews.productId, productId)
      ),
    });

    if (existedReview) {
      return {
        error: {
          message: "You have already reviewed this product",
        },
      };
    }

    const review = await db
      .insert(reviews)
      .values({
        rating,
        comment,
        productId,
        userId: session.user.id,
      })
      .returning();

    revalidatePath(`/products/${productId}`);

    return {
      success: {
        message: "Review added successfully",
      },
    };
  });
