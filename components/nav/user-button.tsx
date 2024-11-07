"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  LogOut, Moon, Settings2, Sun, Truck } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState<boolean>(false);
  const router = useRouter();

  function isThemeDark() {
    switch (theme) {
      case "dark":
        return setChecked(true);
      case "light":
        return setChecked(false);
      case "system":
        return setChecked(false);
    }
  }

  useEffect(() => {
    isThemeDark();
  }, []);

  if (user) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="focus-visible:outline-none">
          <Avatar className="w-7 h-7">
            {user.image && (
              <Image
                src={user.image as string}
                alt="avatar"
                className="rounded-full w-12 h-12 p-0 m-0 "
                loading="lazy"
                width={48}
                height={48}
              />
            )}
            {!user.image && (
              <AvatarFallback>
                <div className="font-extrabold bg-primary text-secondary rounded-full h-12 w-12 flex justify-center items-center">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6" align="end">
          <div className="mb-4 flex flex-col items-center justify-center p-4 bg-primary/10">
            {user.image && (
              <Image
                src={user.image}
                width={40}
                height={40}
                alt="profile"
                loading="lazy"
                className="rounded-full"
              />
            )}
            <p className="my-1 text-xs ">{user.name}</p>
            <p className="text-xs flex items-center ">
              {user.email?.slice(0, 5)}
             ***@**.**
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="py-2 cursor-pointer transition-all duration-500 group ease-in-out"
          >
            <Truck
              size={14}
              className="mr-3 group-hover:translate-x-1 transition-all duration-500 ease-in-out"
            />
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="py-2 group cursor-pointer transition-all duration-500 ease-in-out"
          >
            <Settings2
              size={14}
              className="mr-3 group-hover:rotate-180 transition-all duration-500 ease-in-out"
            />
            Settings
          </DropdownMenuItem>
          {theme && (
            <DropdownMenuItem className="py-2 group transition-all duration-300 ease-in-out">
              <div
                className="flex items-center justify-center "
                onClick={(e) => e.stopPropagation()}
              >
                {theme === "dark" ? (
                  <Moon size={14} className="group-hover:text-blue-600 mr-3" />
                ) : (
                  <Sun size={14} className="group-hover:text-yellow-400 mr-3" />
                )}
                <p>
                  Theme
                  <span className="ml-1 text-yellow-800 dark:text-blue-400 ">
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </span>
                </p>
                <Switch
                  className="scale-75 ml-2"
                  checked={checked}
                  onCheckedChange={(e) => {
                    setChecked((prev) => !prev);
                    if (e) {
                      setTheme("dark");
                    } else {
                      setTheme("light");
                    }
                  }}
                />
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="group focus:bg-destructive/25 cursor-pointer py-2"
            onClick={() => signOut()}
          >
            <LogOut
              size={14}
              className="mr-3 group-hover:scale-75 transition-all duration-500 ease-out"
            />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

export default UserButton;
