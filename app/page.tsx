import { Button } from "@/components/ui/button";
import Image from "next/image";
import firstImg from "@/public/home_page/1.jpg";
import secondImg from "@/public/home_page/2.jpg";
import thirdImg from "@/public/home_page/3.jpg";
import fourthImg from "@/public/home_page/4.jpg";
import fifthImg from "@/public/home_page/5.jpg";
import sixthImg from "@/public/home_page/6.jpg";
import seventhImg from "@/public/home_page/7.jpg";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="">
    <div className="relative overflow-hidden bg-background">
      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl sm:static">
          <div className="sm:max-w-lg">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-primary sm:text-5xl">
              Summer styles are finally here
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-white/75">
             Best collection of summer styles for you. Get ready for summer with our new collection.
            </p>
          </div>
          <div>
            <div className="mt-10 select-none" >
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <Image
                        loading="lazy"
                          src={firstImg}
                          alt="first image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <Image
                      loading="lazy"
                          src={secondImg}
                          alt="second image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <Image
                      loading="lazy"
                          src={thirdImg}
                          alt="first image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <Image
                      loading="lazy"
                          src={fourthImg}
                          alt="fourth image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <Image
                      loading="lazy"
                          src={sixthImg}
                          alt="sixth image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <Image
                      loading="lazy"
                          src={fifthImg}
                          alt="fifth image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <Image
                      loading="lazy"
                          src={seventhImg}
                          alt="seventh image"
                          placeholder="blur"
                          width={176}
                          height={256}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                <Link href="/products" >
                <Button size="lg" variant="default">
                  Shop the collection
                </Button>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}
