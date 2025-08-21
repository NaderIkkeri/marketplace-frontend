import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            DataMarketplace
          </Link>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/browse" className="hover:text-gray-300">
                Browse Datasets
              </Link>
            </li>
            <li>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Connect Wallet
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} DataMarketplace. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}