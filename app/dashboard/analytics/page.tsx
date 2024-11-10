import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card'
import db from '@/server'
import { orderProduct } from '@/server/schema'
import { desc } from 'drizzle-orm'
import Sales from './sales'
import Earnings from './earnings'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export const revalidate = 0;

export default async function Analytics() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return redirect("/");
  }
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    with: {
      order: {
        with: {
          user: true,
        }
      },
      product: true,
      productVariants: {
        with: {
          variantImages: true,
        }
      },
    }
  })

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Page</CardTitle>
          <CardDescription>Show Your Analytics</CardDescription>
        </CardHeader>
        <CardContent>
          You have no orders.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>check your sales</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8">
        <Sales totalOrders={totalOrders} />
        <Earnings totalOrders={totalOrders} />
      </CardContent>
    </Card>
  )
}