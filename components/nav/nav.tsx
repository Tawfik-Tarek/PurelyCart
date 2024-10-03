import { auth } from "@/server/auth";
import Logo from "@/components/nav/logo";
import UserButton from "@/components/nav/user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";

const nav = async () => {
  const session = await auth();

  return (
    <header className="py-6 h-[100px]">
      <nav>
        <ul className="flex justify-between items-center gap-2 sm:gap-4 md:gap-8">
          <li className="flex-1">
            <Link href={"/"} aria-label="logo">
              <Logo />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li>
              <Button asChild variant={"secondary"} className="h-8 bg-primary transition-all duration-200 ease-in-out">
                <Link
                  aria-label="log-in"
                  href={"/auth/login"}
                  className="text-center flex gap-2 items-center justify-center h-7 w-[60px] md:w-[90px]"
                >
                  <LogIn className="h-4" />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
              <li >
                <UserButton
                  expires={session?.expires as string}
                  user={session?.user}
                />
              </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default nav;
