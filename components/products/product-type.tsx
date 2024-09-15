'use client'
import { VariantsWithImagesTags } from '@/lib/infer-type'
import {motion} from 'framer-motion'
import { useSearchParams } from 'next/navigation'


export default function ProductType({variants}: {variants:VariantsWithImagesTags[]}) {
    const searchParams = useSearchParams()
    const search = searchParams.get('type') || variants[0].productType
    return variants.map((variant) => {
        if (variant.productType === search) {
            return(
                <motion.div key={variant.id}
                initial={{y:4 ,opacity:0}}
                animate={{y:0 ,opacity:1}}
                exit={{y:4 , opacity:0}}
                transition={{duration:0.3}}
                className='text-secondary-foreground font-medium'
                >
                    {search}
                </motion.div>
            )
        }
    }
    )
    }