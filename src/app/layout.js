import "../styles/Layout.css";
import Layout from "../components/Layout";

export const metadata = {
  title: "Data Marketplace",
  description: "Browse and share datasets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}