"use client";
import { verifyEmailToken } from "@/server/actions/tokens";
import { useSearchParams , useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export const VerificationForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [success, setSuccess] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const handelTokenVeification = useCallback(() => {
    if (success || err) {
      return;
    }
    verifyEmailToken(token as string).then((data) => {
      if (data.error) {
        setErr(data.error.message);
      } else if (data.success) {
        setSuccess(data.success.message);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handelTokenVeification();
  }, []);

  return (
    <AuthCard
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      cardTitle="Verify your email"
      showSocials={false}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <p>{!success && !err ? "Verfiying email..." : null} </p>
        <FormSuccess message={success} />
        <FormError message={err} />
      </div>
    </AuthCard>
  );
};
