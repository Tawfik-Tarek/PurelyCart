import DashboardNav from "@/components/nav/dashboard-nav";
import { auth } from "@/server/auth";
import { BarChart, Package, PenSquare, Settings2, Truck } from "lucide-react";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const size = 16;

  const adminLinks =
    session?.user.role === "admin"
      ? ([
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={size} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={size} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={size} />,
          },
        ] as const)
      : [];

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck size={size} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings2 size={size} />,
    },
  ] as const;

  const allLinks = [...adminLinks,...userLinks];


  return (
    <div>
      <DashboardNav allLinks={allLinks} />
      {children}
    </div>
  );
}
