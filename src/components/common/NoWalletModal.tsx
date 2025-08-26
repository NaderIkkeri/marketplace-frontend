// src/components/common/NoWalletModal.tsx
"use client";

import Image from 'next/image'; // 👈 1. Import the Image component

interface NoWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoWalletModal({ isOpen, onClose }: NoWalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg p-8 max-w-sm w-full text-center flex flex-col items-center">
        
        {/* 2. Add the MetaMask Logo */}
        <Image
          src="/metamask-logo.svg"
          alt="MetaMask Logo"
          width={80}
          height={80}
          className="mb-4"
        />

        <h2 className="text-2xl font-bold mb-3">Install MetaMask</h2>
        <p className="text-gray-400 mb-6">
          You&apos;ll need a browser wallet to continue. Install MetaMask to get started.
        </p>
        
        {/* 3. The main button is now more direct */}
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Go to MetaMask Site
        </a>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white mt-4 text-sm"
        >
          I&apos;ll do this later
        </button>
      </div>
    </div>
  );
}