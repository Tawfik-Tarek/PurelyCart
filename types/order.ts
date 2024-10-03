import z from "zod";

export const orderSchema = z.object({
  total: z.number(),
  status: z.enum(["pending", "completed"]),
  products: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      variantId: z.number(),
    })
  ),
});
