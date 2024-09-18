import * as z from "zod";

export const reviewsSchema = z.object({
  rating: z
    .number()
    .min(1, {
      message: "Rating must be between 1 and 5",
    })
    .max(5, {
      message: "Rating must be between 1 and 5",
    }),
  comment: z
    .string()
    .min(4, {
      message: "Comment must be at least 4 characters",
    })
    .max(255, {
      message: "Comment must be at most 255 characters",
    }),

  productId: z.number(),
});
