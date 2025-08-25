// src/components/Layout.tsx

import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}