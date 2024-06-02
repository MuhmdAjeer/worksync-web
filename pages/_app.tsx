import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/providers/ReactQuery";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/lib/store-context";
import AppProvider from "@/lib/app-provider";

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
    <main
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}
    >
      <SessionProvider session={session}>
        <StoreProvider {...pageProps}>
          <AppProvider>
            {getLayout(
              <ReactQueryProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Component {...pageProps} />
                </ThemeProvider>
              </ReactQueryProvider>
            )}
          </AppProvider>
        </StoreProvider>
      </SessionProvider>
    </main>
  );
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
