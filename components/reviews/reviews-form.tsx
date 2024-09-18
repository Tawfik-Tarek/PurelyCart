"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { reviewsSchema } from "@/types/reviews-schema";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewsForm() {
  const search = useSearchParams();
  const productId = search.get("productId");

  const form = useForm<z.infer<typeof reviewsSchema>>({
    resolver: zodResolver(reviewsSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof reviewsSchema>) => {
    console.log(data);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button
            type="button"
            variant={"secondary"}
            className="w-full font-medium"
          >
            Write a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="comment">comment</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="comment"
                      placeholder="Write your review here"
                    />
                    <FormMessage {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>rating</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Rating must be between 1 and 5"
                      type="hidden"
                    />
                    <FormMessage {...field} />
                  </FormControl>
                  <div>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.div
                        className="cursor-pointer relative"
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          size={24}
                          className={cn(
                            "text-primary bg-transparent transition-all duration-300 ease-in-outhover:text-yellow-500",
                            rating <= form.getValues("rating")
                              ? "text-primary"
                              : "text-muted"
                          )}
                          onClick={() => {
                            form.setValue("rating", rating);
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
