// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast"; // Import the Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataMarketplace",
  description: "A decentralized marketplace for verifiable data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Add the Toaster component here */}
          <Toaster />
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}