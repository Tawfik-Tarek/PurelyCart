import SkeletonProduct from "@/components/products/skeleton-product";

export default function Loading() {
  return (
    <div className="min-h-[calc(100dvh-100px)] px-4 py-8">
      {/* Title placeholder */}
      {/* <div className="h-8 w-1/3 bg-gray-300 rounded mb-6 animate-pulse" /> */}
      
      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {[...Array(6)].map((_, index) => (
          <SkeletonProduct key={index} />
        ))}
      </div>
    </div>
  );
}
