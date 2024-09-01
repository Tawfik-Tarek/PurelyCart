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
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  

  const [err, setErr] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { execute, status } = useAction(newPassword, {
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

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    execute({password:data.password , token});
  };

  return (
    <AuthCard
      cardTitle="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="********"
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
            {"Update password"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
