"use client";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function ToasterComponent() {
  const { theme } = useTheme();
  if (typeof theme === "string") {
    return <Toaster richColors theme={theme as 'light' | 'dark' | 'system' | undefined}/>;
  }
}
