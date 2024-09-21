'use client'

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            rating > i ? "fill-yellow-500 text-yellow-500" : "fill-transparent"
          )}
        />
      ))}
    </div>
  );
}