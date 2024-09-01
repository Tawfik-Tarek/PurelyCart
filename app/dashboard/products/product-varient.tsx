"use client";

import React, { useEffect, useState } from "react";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { VrientSchema } from "@/types/vrient-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputTags } from "./input-tags";
import VariantImages from "./varient-images";
import { addVarient } from "@/server/actions/add-varient";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteVarient } from "@/server/actions/delete-varient";

// ForwardRef to pass ref to the Dialog component
const ProductVarient = React.forwardRef<
  HTMLDivElement,
  {
    editMode: boolean;
    productId: number;
    variant?: VariantsWithImagesTags;
    children?: React.ReactNode;
  }
>(({ editMode, productId, variant, children }, ref) => {
  const formMethods = useForm<z.infer<typeof VrientSchema>>({
    resolver: zodResolver(VrientSchema),
    defaultValues: {
      productId: productId,
      id: undefined,
      editMode,
      productType: "",
      color: "#000000",
      tags: [],
      variantImages: [],
    },
  });

  const { execute } = useAction(addVarient, {
    onExecute: () => {
      toast.loading("Saving Variant");
    },

    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.dismiss();
        toast.error(data.error.message);
        return;
      } else if (data?.success) {
        toast.dismiss();
        toast.success(data.success.message);
        setOpen(false);
      }
    },
  });

  const DeleteVarient = useAction(deleteVarient, {
    onExecute: () => {
      toast.loading("Deleting Variant");
    },
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.dismiss();
        toast.error(data.error.message);
        return;
      } else if (data?.success) {
        toast.dismiss();
        toast.success(data.success.message);
        setOpen(false);
      }
    },
  });

  function deleteVariant() {
    if (!variant) {
      console.log("No variant found");
      
      return;
    }
    DeleteVarient.execute({ id: variant.id });
  }

  function editModeValues() {
    if (!editMode) {
      return;
    }
    if (editMode && variant) {
      formMethods.setValue("id", variant.id);
      formMethods.setValue("productId", productId);
      formMethods.setValue("productType", variant.productType);
      formMethods.setValue("color", variant.color);
      formMethods.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      formMethods.setValue(
        "variantImages",
        variant.variantImages.map((img) => ({
          name: img.name,
          url: img.url,
          size: img.size,
        }))
      );
    }
  }

  function onSubmit(data: z.infer<typeof VrientSchema>) {
    execute(data);
  }
  const [open, setOpen] = useState(false);

  useEffect(() => {
    editModeValues();
  }, [editMode]);

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        ref={ref}
        className="sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg overflow-y-scroll  max-h-[660px]"
      >
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} Your Variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add multiple variants to
            a single product.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={formMethods.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varient Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Pick A Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varient Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varient Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <VariantImages />

            <div className="flex justify-center items-center gap-4 py-8">
              {editMode && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteVariant();
                  }}
                >
                  Delete Varient
                </Button>
              )}
              <Button type="submit">
                {editMode ? "Update" : "Create"} varient
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
});

// Setting displayName for the forwardRef component
ProductVarient.displayName = "ProductVarient";

export default ProductVarient;
