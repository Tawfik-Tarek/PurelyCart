import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card'
import db from '@/server'
import { orderProduct } from '@/server/schema'
import { desc } from 'drizzle-orm'
import Sales from './sales'

export default async function Analytics() {
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 5,
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
      <CardContent>
        <Sales totalOrders={totalOrders}/>
      </CardContent>
    </Card>
  )
}