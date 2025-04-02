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
import { useAction } from "next-safe-action/hooks";
import { addReview } from "@/server/actions/add-review";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function ReviewsForm({
  hasPurchased = false,
}: {
  hasPurchased?: boolean;
}) {
  const search = useSearchParams();
  const productId = search.get("productId");
  const [open, setOpen] = useState<boolean>(false);

  const { execute, status } = useAction(addReview, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success.message);
        setOpen(false);
        form.reset();
      } else if (data?.error) {
        toast.error(data.error.message);
      }
    },
  });

  const form = useForm<z.infer<typeof reviewsSchema>>({
    resolver: zodResolver(reviewsSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      productId: Number(productId),
    },
  });

  const onSubmit = (data: z.infer<typeof reviewsSchema>) => {
    execute({
      rating: data.rating,
      comment: data.comment,
      productId: Number(productId),
    });
  };

  if (!hasPurchased) {
    return (
      <Card className="p-4 mb-4 text-center">
        <p className="text-muted-foreground">
          You can only review products you&apos;ve purchased
        </p>
      </Card>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      modal={false}
    >
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button
            type="button"
            variant={"secondary"}
            className="w-full font-medium"
            onClick={() => setOpen(true)}
          >
            Write a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="relative">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
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
                  </FormControl>
                  <FormMessage {...field} />
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
                  </FormControl>
                  <FormMessage {...field} />
                  <div className="flex">
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
                              ? "fill-primary"
                              : "fill-transparent"
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

            <Button
              type="submit"
              className="w-full"
              disabled={status === "executing"}
            >
              {status === "executing" ? "Submitting..." : "Submit"}
            </Button>
          </form>
          <div className="absolute top-1 right-3">
            <Button
              variant={"destructive"}
              className="w-4 h-4 p-3"
              onClick={() => setOpen(false)}
            >
              X
            </Button>
          </div>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
