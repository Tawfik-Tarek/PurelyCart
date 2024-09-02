import type { Metadata } from "next";
import Favicon from "@/public/favicon.ico";
import Nav from "@/components/nav/nav";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopSphere",
  description: "Generated by Tawfik Tarek",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("px-6 md:px-12 max-w-7xl mx-auto", `${inter.className}`)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <Toaster  richColors/>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}