// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} DataMarketplace. All Rights Reserved.
      </div>
    </footer>
  );
}