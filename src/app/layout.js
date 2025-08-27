import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout"; // ✅ use relative path (fix alias issue)

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Data Marketplace",
  description: "A decentralized marketplace for ML datasets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Wrap all children inside Layout */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
