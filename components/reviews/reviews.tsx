import db from "@/server";
import ReviewsForm from "./reviews-form";
import { desc, eq } from "drizzle-orm";
import { reviews, orders, orderProduct } from "@/server/schema";
import Review from "./review";
import ReviewChart from "./ReviewChart";
import { auth } from "@/server/auth";

export default async function Reviews({ productId }: { productId: number }) {
  const currentReviews = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    limit: 5,
    with: { user: true },
    orderBy: [desc(reviews.created)],
  });

  // Check if the current user has purchased this product
  const session = await auth();
  let hasPurchased = false;

  if (session) {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      with: {
        orderProduct: {
          where: eq(orderProduct.productId, productId),
        },
      },
    });

    hasPurchased = userOrders.some((order) => order.orderProduct.length > 0);
  }

  return (
    <section className="py-4">
      <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
          <ReviewsForm hasPurchased={hasPurchased} />
          <Review reviews={currentReviews} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewChart reviews={currentReviews} />
        </div>
      </div>
    </section>
  );
}
