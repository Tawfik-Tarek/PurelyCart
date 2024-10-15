import db from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistance, subMinutes } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";

export default async function Orders() {
  const user = await auth();
  if (!user) {
    return redirect("/auth/login");
  }
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: {
            with: {
              variantImages: true,
            },
          },
          order: true,
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order Num.</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "succeed"
                          ? "bg-green-700"
                          : "bg-secondary-foreground hover:bg-secondary-foreground/80"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {formatDistance(subMinutes(order.created!, 0), new Date(), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className="focus-visible:ring-0 focus-visible:outline-none"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <DialogTrigger>
                              <Button className="w-full" variant={"ghost"}>
                                View Details
                              </Button>
                            </DialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order Details #{order.id}</DialogTitle>
                        </DialogHeader>
                        <Card className="overflow-auto p-2 flex flex-col gap-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Quantity</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.orderProduct.map(
                                ({ product, productVariants, quantity }) => (
                                  <TableRow
                                    key={product.id}
                                  >
                                    <TableCell>
                                      <Image
                                        src={
                                          productVariants.variantImages[0].url
                                        }
                                        alt={`image for product-${product.id}`}
                                        width={48}
                                        height={48}
                                      />
                                    </TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell className="text-xs font-medium">{product.title}</TableCell>
                                    <TableCell>
                                        <div className={`w-4 h-4 rounded-full`}
                                            style={{backgroundColor:productVariants.color}}
                                        ></div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium">{quantity}</TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </Card>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
