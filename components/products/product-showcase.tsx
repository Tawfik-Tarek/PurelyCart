"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductShowcase({
  productVariants,
}: {
  productVariants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState([0]);
  const searchParams = useSearchParams();
  const search = searchParams.get("type") || productVariants[0].productType;

  useEffect(()=>{
    if(!api) return
    api.on("slidesInView" , (e)=>{
        setActiveIndex(e.slidesInView())
    })
  } , [api]);

  return (
    <Carousel
      className="select-none relative"
      setApi={setApi}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {productVariants.map(
          (variant) =>
            variant.productType === search &&
            variant.variantImages.map((img, index) => (
              <CarouselItem key={img.id}>
                {img.url && (
                  <Image
                    src={img.url}
                    alt={"image" + img.id.toString()}
                    width={1280}
                    height={720}
                    priority={true}
                    className="rounded-md"
                  />
                )}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      <CarouselPrevious
        className="absolute left-1"
      />
      <CarouselNext
        className="absolute right-1"
      />

      <div className="flex gap-5 mt-5 overflow-clip">
        {productVariants.map(
          (variant) =>
            variant.productType === search &&
            variant.variantImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => {
                  api?.scrollTo(index);
                }}
                className={`w-16 h-16 cursor-pointer transition-all duration-100 ease-in-out ${
                  activeIndex[0] === index
                    ? "opactity-100 border-primary-foreground"
                    : "opacity-50 border-secondary-foreground"
                }`}
              >
                {img.url && (
                  <Image
                    src={img.url}
                    alt={"image" + img.id.toString()}
                    width={1280}
                    height={720}
                    className="rounded-md"
                  />
                )}
              </div>
            ))
        )}
      </div>
    </Carousel>
  );
}
