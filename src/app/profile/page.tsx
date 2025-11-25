"use client";

import { useWallet } from '@/context/WalletContext';
import { Copy, Check, Wallet, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProfilePage() {
  const { walletAddress, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view your profile.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">
            Your <span className="glow-text-purple">Profile</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Manage your wallet and account settings
          </p>

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
            {/* Header with Gradient */}
            <div className="relative h-32 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>

            {/* Avatar */}
            <div className="relative px-8 -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-4 border-[#0d0d0d] flex items-center justify-center shadow-2xl">
                <Wallet className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              <h2 className="text-3xl font-bold mb-2">{shortAddress}</h2>
              <p className="text-gray-400 mb-8">Connected Wallet</p>

              {/* Wallet Address Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Wallet Address</label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <code className="font-mono text-sm text-white flex-1 break-all">{walletAddress}</code>
                    <button
                      onClick={copyAddress}
                      className="flex-shrink-0 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-200"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* View on Explorer */}
                <div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">View on Etherscan</span>
                  </a>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      href="/dashboard"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-200 text-center font-medium"
                    >
                      View Portfolio
                    </Link>
                    <Link
                      href="/browse"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-200 text-center font-medium"
                    >
                      Browse Datasets
                    </Link>
                    <Link
                      href="/create"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-200 text-center font-medium"
                    >
                      Create Dataset
                    </Link>
                    <button
                      onClick={disconnectWallet}
                      className="px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 text-center font-medium text-red-400"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>

                {/* Network Info */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Network Information</h3>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Network</span>
                      <span className="text-sm font-medium text-white">Sepolia Testnet</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Chain ID</span>
                      <span className="text-sm font-medium text-white">11155111</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
