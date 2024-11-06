import BetweenDates from "./between-dates";

export default function MonthlyChart(
  chartItems: { date: Date; revenue: number }[]
) {
  return [
    {
      date: "3 weeks ago",
      revenue: chartItems
        .filter((order) => BetweenDates(order.date, 28, 21))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2 weeks ago",
      revenue: chartItems
        .filter((order) => BetweenDates(order.date, 21, 14))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "1 week ago",
      revenue: chartItems
        .filter((order) => BetweenDates(order.date, 14, 7))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "this week",
      revenue: chartItems
        .filter((order) => BetweenDates(order.date, 7, 0))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ];
}
