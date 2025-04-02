"use client";
import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import Stars from "./stars";

// Default avatar for users without images
const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
  return (
    <motion.div className="flex flex-col gap-4 my-2">
      {reviews.length === 0 && (
        <p className="text-center text-muted-foreground py-2 font-medium">No reviews yet</p>
      )}
      {reviews.length > 0 &&
        reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex gap-2 items-center">
              {/* Add proper null checking and fallback for images */}
              <Image
                className="rounded-full"
                width={32}
                height={32}
                alt={review?.user?.name || "User"}
                src={review?.user?.image || DEFAULT_AVATAR}
              />
              <div>
                <p className="text-sm font-bold">{review?.user?.name || "Anonymous User"}</p>
                <div className="flex items-center gap-2">
                  <Stars rating={review.rating} />
                  <p className="text-xs font-bold text-muted-foreground">
                    {formatDistance(subDays(review.created || new Date(), 0), new Date())}
                  </p>
                </div>
              </div>
            </div>
            <p className="py-2 font-medium">{review.comment}</p>
          </Card>
        ))}
    </motion.div>
  );
}
