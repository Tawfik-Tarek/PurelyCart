import { cn } from "@/lib/utils";

export default function LoadingPage() {
  return (
    <>
    {/* overlay and topbar */}
      <div className="flex items-center justify-center h-full w-[10000px] overflow-hidden fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className={cn("fixed top-0 left-0 h-1 bg-primary z-40 transition-all duration-150 ease-in-out", 'w-full')} />
        <div className="absolute inset-0 bg-black/50 z-20 w-full animate-pulse-slow" />
      </div>

      <div className="p-4 space-y-4 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-300 rounded w-1/3" />

        {/* Skeletons for items */}
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded w-full" />
          <div className="h-24 bg-gray-200 rounded w-full" />
          <div className="h-24 bg-gray-200 rounded w-full" />
        </div>

        {/* Placeholder for other page elements */}
        <div className="h-8 bg-gray-300 rounded w-2/3" />
        <div className="h-8 bg-gray-300 rounded w-1/2" />
      </div>
    </>
  );
}
