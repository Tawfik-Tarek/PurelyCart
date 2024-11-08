"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormatPrice from "@/lib/format-price";
import { TotalOrders } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import WeeklyChart from "./weekly-chart";
import { useMemo } from "react";
import MonthlyChart from "./monthly-chart";

export default function Earnings({ totalOrders }: { totalOrders: TotalOrders[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let period = searchParams.get("period") || "week";
  if (period !== "week" && period !== "month") {
    period = "week";
  }

  const totalOrdersCount = totalOrders.length;
  const totalProducts = totalOrders.reduce((sum, order) => sum + order.quantity, 0);

  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total,
  }))

  const activeChart = useMemo(() => {
    const weekly = WeeklyChart(chartItems)
    const monthly = MonthlyChart(chartItems)
    if (period === "week") {
      return weekly
    } else if (period === "month") {
      return monthly
    }
  }, [period])

  const activeTotal = useMemo(() => {
    if (period === "month") {
      return FormatPrice(MonthlyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0))
    }
    return FormatPrice(WeeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0))
  }, [period])

  const handleRouteChange = (url: string) => {
    router.push(url, { scroll: false });
  };


  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: {activeTotal}</CardTitle>
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
      <CardContent className="h-96 px-0 sm:px-6">
        {totalOrdersCount === 0 ? (
          <div>You have no earnings</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={(props) => {
                return (
                  <div>
                    {props.payload?.map((item) => {
                      return (
                        <div key={item.payload.date} className="bg-white text-primary p-2 rounded-md shadow-md">
                          <p>Revenue: {item.payload.revenue}$</p>
                          <p>Date: {item.payload.date}</p>
                        </div>
                      )
                    })}
                  </div>
                )
              }} />
              <YAxis dataKey="revenue" />
              <XAxis dataKey="date" />
              <Bar dataKey="revenue" className="fill-primary" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}