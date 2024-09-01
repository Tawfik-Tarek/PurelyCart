"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./auth-card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { ResetFormSchema } from "@/types/reset-form";
import { passwordReset } from "@/server/actions/password-reset";

export default function ResetForm() {
  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const [err, setErr] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { execute, status } = useAction(passwordReset, {
    onSuccess(data) {
      if (data.data?.error) {
        setSuccess("");
        setErr(data.data.error.message);
      } else if (data.data?.success) {
        setErr("");
        setSuccess(data.data.success.message);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof ResetFormSchema>) => {
    execute(data);
  };

  return (
    <AuthCard
      cardTitle="Enter your email to reset your password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="tawfik@gmail.com"
                    disabled={status === "executing"}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormSuccess message={success} />
          <FormError message={err} />

          <Button
            className={cn(
              "my-1 w-full",
              status === "executing" && "animate-pulse"
            )}
            type="submit"
          >
            {"Reset password"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
