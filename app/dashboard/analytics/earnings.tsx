"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormatPrice from "@/lib/format-price";
import { TotalOrders } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Earnings({ totalOrders }: { totalOrders: TotalOrders[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "week";

  const totalRevenue = totalOrders.reduce((sum, order) => sum + order.product.price * order.quantity, 0);
  const totalOrdersCount = totalOrders.length;
  const totalProducts = totalOrders.reduce((sum, order) => sum + order.quantity, 0);

  const handleRouteChange = (url: string) => {
    router.push(url, { scroll: false });
  };

  const formattedTotalRevenue = FormatPrice(totalRevenue);

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: {formattedTotalRevenue}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
      </CardHeader>
      <div className="flex gap-3 flex-wrap items-center mb-5 pl-5">
        <Badge
          className={cn("cursor-pointer", period === "week" ? "bg-primary" : "bg-primary/25")}
          onClick={() => handleRouteChange("/dashboard/analytics?period=week")}
        >
          This Week
        </Badge>
        <Badge
          className={cn("cursor-pointer", period === "month" ? "bg-primary" : "bg-primary/25")}
          onClick={() => handleRouteChange("/dashboard/analytics?period=month")}
        >
          This Month
        </Badge>
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
    </Card>
  );
}