"use client";

import Image from 'next/image';

interface NoWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoWalletModal({ isOpen, onClose }: NoWalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 pointer-events-none"></div>

        <div className="relative z-10">
          {/* MetaMask Logo - Official logo from public folder */}
          <div className="mx-auto mb-6 flex items-center justify-center">
            <Image
              src="/metamask-logo.svg"
              alt="MetaMask Logo"
              width={96}
              height={96}
              className="w-24 h-24"
            />
          </div>

          <h2 className="text-3xl font-bold mb-3">MetaMask Required</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            You need MetaMask wallet extension to interact with QuantifyX.
            MetaMask is a secure crypto wallet that enables Web3 applications.
          </p>

          {/* Features List */}
          <div className="mb-8 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Secure & Trusted</p>
                <p className="text-gray-500 text-xs">Used by millions worldwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Easy to Use</p>
                <p className="text-gray-500 text-xs">Simple browser extension</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Free to Install</p>
                <p className="text-gray-500 text-xs">No cost to get started</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/50 mb-4"
          >
            Install MetaMask Extension
          </a>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
