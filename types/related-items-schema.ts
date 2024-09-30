import z from "zod";
import { ProductSchema } from "./product-schhema";

export const RelatedItemsSchema = z.object({
  relatedProducts: z.array(ProductSchema),
});