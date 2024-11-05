import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableRow, TableCell, TableCaption, TableHeader } from '@/components/ui/table'
import formatName from '@/lib/format-name'
import { TotalOrders } from '@/lib/infer-type'
import { UserCircle2 } from 'lucide-react'
import Image from 'next/image'

export default async function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map((order) => (
              <TableRow key={order.id} className='font-medium'>
                <TableCell>
                  {order.order.user && (
                    <div className='flex items-center gap-2 w-32 md:w-auto'>
                      {order.order.user.image && order.order.user.name ? (
                        <Image
                          src={order.order.user.image}
                          alt={order.order.user.name}
                          width={25}
                          height={25}
                          className="rounded-full"
                        />
                      ) : (
                        <UserCircle2 size={25} />
                      )}
                      {order.order.user.name ? formatName(order.order.user.name) : 'Unknown User'}
                    </div>
                  )}
                </TableCell>
                <TableCell><div className='w-32 md:w-auto'>{order.product.title}</div></TableCell>
                <TableCell>{order.product.price}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Image
                    src={order.productVariants.variantImages[0].url}
                    alt={order.product.title}
                    width={50}
                    height={50}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}