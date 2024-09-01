import * as z from "zod";


// Function to strip HTML tags from a string
function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>?/gm, "");
}

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Product title should be 5 characters at least",
  }),
  description: z
    .string()
    .min(40, {
      message: "Product description should be 40 characters at least",
    }).refine(
      (value) => stripHtmlTags(value).length >= 40,
      "Product description should be 40 characters at least"
    ),
  price: z.coerce
    .number({
      message: "Price should be a number",
    })
    .positive("Price should be a positive number"),
  //   image: z.string().url("Image should be a valid URL"),
  //   category: z.string().min(3, "Category should be 3 characters at least"),
  //   stock: z.number().int().positive("Stock should be a positive number"),
  //   brand: z.string().min(3, "Brand should be 3 characters at least"),
  //   rating: z.number().int().positive("Rating should be a positive number"),
  //   numReviews: z
  //     .number()
  //     .int()
  //     .positive("Number of reviews should be a positive number"),
  //   countInStock: z
  //     .number()
  //     .int()
  //     .positive("Count in stock should be a positive number"),
});
