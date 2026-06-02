import "@/styles/globals.css";
import { type Metadata } from "next";

import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "CodeAtlas",
  description: "AI powered",
  icons: {
    icon: "/chip1.svg",
  },
};


const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
     <ClerkProvider>
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
         
        <TRPCReactProvider>
        {children}
        </TRPCReactProvider>
        <Toaster theme="dark"/>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
