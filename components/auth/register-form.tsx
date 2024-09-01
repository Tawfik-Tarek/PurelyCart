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
import { RegisterSchema } from "@/types/register-schema";
import { emailRegister } from "@/server/actions/email-register";
import FormError from "./form-error";
import FormSuccess from "./form-success";

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const [err, setErr] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.success) {
        setSuccess(data.data.success.message);
      } else if (data.data?.error) {
        setErr(data.data.error.message);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    execute(data);
  };

  return (
    <AuthCard
      cardTitle="Create An Account 👋"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    autoComplete="name"
                    placeholder="tawfik"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="tawfik_tarek@gmail.com"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

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
            {"Register"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
