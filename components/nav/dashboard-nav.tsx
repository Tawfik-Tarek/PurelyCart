"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface Link {
  readonly label: string;
  readonly path: string;
  readonly icon: JSX.Element;
}

export default function DashboardNav({ allLinks }: { allLinks: Link[] }) {
  const path = usePathname();
  return (
    <div className=" pb-3 flex items-center gap-5 overflow-hidden">
      <AnimatePresence>
        {allLinks.map((li) => {
          return (
            <Link
              key={li.path}
              href={li.path}
              className={cn(
                "flex flex-col gap-1 items-center font-bold text-[0.5rem] sm:text-xs lg:text-sm relative",
                path === li.path && "text-primary"
              )}
            >
              {li.icon}
              {li.label}
              {
                path === li.path && (
                    <motion.div
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                )
              }
            </Link>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
