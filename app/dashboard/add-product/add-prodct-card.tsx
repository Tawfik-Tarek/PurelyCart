"use client";

import { useForm } from "react-hook-form";
import { ProductSchema } from "@/types/product-schhema";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { addProduct } from "@/server/actions/add-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

export default function AddProductCard() {
  const params = useSearchParams();
  const editMode = params.get("id");

  const { execute, status } = useAction(addProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.dismiss();
        router.push("/dashboard/products");
        toast.success(data.success.message);
      } else if (data?.error) {
        toast.dismiss();
        toast.error(data.error.message);
      }
    },
    onExecute: () => {
      if (editMode) {
        toast.loading("Updating product...");
      } else {
        toast.loading("Adding product...");
      }
    },
  });

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      description: "",
      price: 0,
      title: "",
      id: Number(editMode),
    },
    mode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof ProductSchema>) => {
    execute(data);
  };

  const router = useRouter();

  const checkEditMode = async () => {
    if (editMode) {
      const data = await getProduct({ id: parseInt(editMode) });
      if (data?.data?.success) {
        form.setValue("title", data.data.success.product.title);
        form.setValue("description", data.data.success.product.description);
        form.setValue("price", data.data.success.product.price);
      } else if (data?.data?.error) {
        toast.error(data.data.error.message);
      }
    }
  };

  useEffect(() => {
    checkEditMode();
  }, [editMode]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Update" : "Add"} Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="product name"
                      {...field}
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <DollarSign
                        size={36}
                        className="bg-muted p-2 rounded-md"
                      />
                      <Input
                        type="number"
                        placeholder="product price"
                        {...field}
                        step={"0.1"}
                        min={0}
                        disabled={status === "executing"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
