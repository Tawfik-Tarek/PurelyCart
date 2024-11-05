"use client";

import LoadingPage from "@/components/loading/loading-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormatPrice from "@/lib/format-price";
import { TotalOrders } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Earnings({ totalOrders }: { totalOrders: TotalOrders[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const period = searchParams.get("period") || "week";
  const [isLoading, setIsLoading] = useState(false);

  const totalRevenue = totalOrders.reduce((sum, order) => sum + order.product.price * order.quantity, 0);
  const totalOrdersCount = totalOrders.length;
  const totalProducts = totalOrders.reduce((sum, order) => sum + order.quantity, 0);

  // useEffect(() => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // }, [pathName, searchParams]);

  if (period !== "week" && period !== "month") {
    router.replace("/dashboard/analytics?period=week");
  }

  const formattedTotalRevenue = FormatPrice(totalRevenue);

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: {formattedTotalRevenue}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
      </CardHeader>
      <div className="flex gap-3 flex-wrap items-center mb-5 pl-5">
        <Badge className={cn("cursor-pointer", period === "week" ? "bg-primary" : "bg-primary/25")} onClick={() => {
          router.push("/dashboard/analytics?period=week", { scroll: false });
        }}>This Week</Badge>
        <Badge className={cn("cursor-pointer", period === "month" ? "bg-primary" : "bg-primary/25")} onClick={() => {
          router.push("/dashboard/analytics?period=month", { scroll: false });
        }}>This Month</Badge>
      </div>
      <CardContent>
        {totalOrdersCount === 0 ? (
          <div>You have no earnings</div>
        ) : (
          <div>
              <div>Revenue: {formattedTotalRevenue}</div>
            <div>Orders: {totalOrdersCount}</div>
            <div>Products: {totalProducts}</div>
          </div>
        )}
      </CardContent>
      {/* {isLoading && <LoadingPage />} */}
    </Card>
  );
}
