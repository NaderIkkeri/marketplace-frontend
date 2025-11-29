"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/browse', label: 'Explore', show: true },
    { href: '/dashboard', label: 'Portfolio', show: walletAddress },
    { href: '/profile', label: 'Profile', show: walletAddress },
  ];

  return (
    <header className={`sticky top-0 z-50 ${isHomePage ? 'bg-[#0d0d0d]/80' : 'bg-[#0d0d0d]'} backdrop-blur-xl border-b border-white/5`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo className="w-12 h-12" />
            <span className="text-lg font-bold hidden sm:block">QuantifyX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) =>
              link.show && (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {walletAddress ? (
              <>
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Connected
                </Link>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2.5 rounded-xl font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
                  title="Disconnect wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
              >
                Connect
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.show && (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      pathname === link.href
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {walletAddress ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Connected
                  </Link>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200 flex items-center gap-2 justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
