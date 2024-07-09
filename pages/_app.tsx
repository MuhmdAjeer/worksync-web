import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/providers/ReactQuery";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/lib/store-context";
import AppProvider from "@/lib/app-provider";
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <main
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ReactQueryProvider>
          <StoreProvider {...pageProps}>
            <AppProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
                {...pageProps}
              >
                <TooltipProvider>
                  <SessionProvider session={session}>
                    {getLayout(<Component {...pageProps} />)}
                  </SessionProvider>
                </TooltipProvider>
              </ThemeProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </AppProvider>
          </StoreProvider>
          <Toaster richColors />
        </ReactQueryProvider>
      </main>
    </>
  );
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
