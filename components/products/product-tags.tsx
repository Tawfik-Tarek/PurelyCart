'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function ProductTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tags = ["all", "blue", "green"];
  const tag = searchParams.get("tag") || "all";

  // Redirect to base URL if tag is invalid
  useEffect(() => {
    if (!tags.includes(tag)) {
      router.push("/products");
    }
  }, [tag, router, tags]);

  const setFilter = (selectedTag: string) => {
    if (selectedTag === "all") {
      router.push("/products");
    } else {
      router.push(`/products?tag=${selectedTag}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {tags.map((item) => (
        <Badge
          key={item}
          className={cn(
            "cursor-pointer transition-opacity duration-200 bg-primary/80 hover:bg-primary",
            "hover:opacity-100",
            tag === item ? "bg-primary text-white opacity-100" : "opacity-50"
          )}
          onClick={() => setFilter(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Badge>
      ))}
    </div>
  );
}
