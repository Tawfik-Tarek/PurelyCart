"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage(){
    return(
        <div className="bg-background h-[calc(100dvh-120px)] flex flex-col gap-8 justify-center items-center">
            <h1 className="font-semibold text-primary text-lg md:text-2xl lg:text-3xl">
                This page dose not exist
            </h1>
            <Button asChild >
                <Link href={'/'}>Go to Homepage</Link>
            </Button>
        </div>
    )
}