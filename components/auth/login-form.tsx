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
import { LoginSchema } from "@/types/login-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [err, setErr] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setSuccess("");
        setErr(data.data.error.message);
      } else if (data.data?.success) {
        setErr("");
        setSuccess(data.data.success.message);
      }
      if (data.data?.twoFactor) {
        setShowTwoFactor(true);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    execute(data);
  };

  return (
    <AuthCard
      cardTitle="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    We&apos;ve sent you a two factor code to your email.
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      disabled={status === "executing"}
                      {...field}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!showTwoFactor && (
            <>
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
            </>
          )}

          <FormSuccess message={success} />
          <FormError message={err} />

          {!showTwoFactor && (
            <Button className="my-1" variant={"link"} size={"sm"} asChild>
              <Link href={"/auth/reset"}>Forgot your password </Link>
            </Button>
          )}

          <Button
            className={cn(
              "my-1 w-full",
              status === "executing" && "animate-pulse"
            )}
            type="submit"
          >
            {showTwoFactor ? "Verify" : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
