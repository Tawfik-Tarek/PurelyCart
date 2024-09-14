import { auth } from "@/server/auth";
import Logo from "@/components/nav/logo";
import UserButton from "@/components/nav/user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

const nav = async () => {
  const session = await auth();

  return (
    <header className="py-6 h-[100px]">
      <nav>
        <ul className="flex justify-between items-center">
          <li>
            <Link href={"/"} aria-label="logo">
              <Logo />
            </Link>
          </li>
          {!session ? (
            <li>
              <Button asChild variant={"secondary"} className="h-8">
                <Link
                  aria-label="log-in"
                  href={"/auth/login"}
                  className="text-center flex gap-2 items-center justify-center"
                >
                  <LogIn className="h-4" />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <>
              <li>
                <UserButton
                  expires={session?.expires as string}
                  user={session?.user}
                />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default nav;
