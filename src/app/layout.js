import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout"; // 1. Import our new Layout component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Data Marketplace",
  description: "A decentralized marketplace for ML datasets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap the children with our Layout component */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}