import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "CodeAtlas",
  description: "AI powered",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <ClerkProvider>
        <TRPCReactProvider>
        {children}
        </TRPCReactProvider>
        </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
