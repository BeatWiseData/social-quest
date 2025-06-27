// src/app/layout.tsx - Fixed for Next.js 15 App Router

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/provider/WagmiProvider";
import ReactQueryProvider from "@/provider/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social Questing Platform",
  description: "Engage, Share & Earn - Complete Social Quests & Get Rewarded!",
  keywords: "social questing, rewards, crypto, web3, community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ReactQueryProvider>
          <Web3Provider>{children}</Web3Provider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
