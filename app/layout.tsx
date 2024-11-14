import type { Metadata } from "next";
import Favicon from "@/public/favicon.ico";
import Nav from "@/components/nav/nav";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Head from "next/head";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PurelyCart",
  description: "PurelyCart store for all your needs",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/public/home_page/3.jpg" as="image" />
      </Head>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-grow px-6 md:px-12 mx-auto max-w-7xl relative">
            <Nav />
            <Toaster richColors />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
