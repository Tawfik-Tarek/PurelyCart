'use client';

import { cn } from "@/lib/utils";

export default function LoadingPage({ width }: { width?: number }) {
  return (
    <div className="flex items-center justify-center h-full w-[10000px] overflow-hidden fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className={cn("fixed top-0 left-0 h-1 bg-primary z-40 transition-all duration-150 ease-in-out", width ? `w-${width}` : 'w-full')} />
      <div className="absolute inset-0 bg-black/50 z-20 w-full animate-pulse-slow" />
    </div>
  );
}