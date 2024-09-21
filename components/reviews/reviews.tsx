import db from "@/server";
import ReviewsForm from "./reviews-form";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import Review from "./review";

export default async function Reviews({ productId }: { productId: number }) {
  const currentReviews = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    limit: 5,
    with: {user: true},
    orderBy: [desc(reviews.created)]
  })
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-3">Product Reviews</h2>
      <div>
        <ReviewsForm />
        <Review reviews={currentReviews} />
      </div>
    </section>
  );
}
