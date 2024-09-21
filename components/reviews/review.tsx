'use client'
import { ReviewsWithUser } from '@/lib/infer-type'
import {motion} from 'framer-motion'
import { Card } from '../ui/card'
import Image from 'next/image'

export default function Review({reviews} : {reviews: ReviewsWithUser[]}) {
    return (
        <motion.div>
            {reviews.map((review) => (
                <Card key={review.id}>
                    <div>
                        {
                            review.user?.image ? (
                                <Image src={review.user.image} alt={review.user.name!} width={32} height={32}  className='rounded-full'/>
                            ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full">
                                    <span className="text-gray-500 text-2xl">{review.user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                            )
                        }

                        <div>
                            <p>{review.user?.name}</p>
                            <div>
                                
                            </div>
                        </div>

                    </div>
                </Card>
            ))}
        </motion.div>
    )
}