"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Socials = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Button
        variant={"outline"}
        className="w-full flex gap-3 flex-row-reverse"
        onClick={() => {
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          });
        }}
      >
        Sign in with Google
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        className="w-full flex gap-3 flex-row-reverse"
        onClick={() => {
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          });
        }}
      >
        Sign in with Github
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Socials;
