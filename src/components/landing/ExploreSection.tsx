"use client";

import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const exploreItems = [
  {
    icon: '🎓',
    title: 'Help center',
    description: 'Browse FAQs and get support from our blockchain-focused support team',
  },
  {
    icon: '✍️',
    title: 'Blog',
    description: 'Catch up on the latest company news, product features and more',
  },
  {
    icon: '📚',
    title: 'Docs',
    description: 'Explore our library of developer docs to get started building with ChainVault',
  },
  {
    icon: '💬',
    title: 'Socials',
    description: 'Follow ChainVault on X, Discord, LinkedIn, and Telegram',
  },
];

export default function ExploreSection() {
  return (
    <section className="py-20 px-4 sm:py-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold mb-4">
              Explore the <span className="glow-text-purple">DataVerse</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {exploreItems.map((item, index) => (
            <ScrollReveal key={item.title} direction="up" delay={index * 100}>
              <div
                className="bg-white/5 border border-white/10 rounded-2xl p-8 card-hover cursor-pointer group h-full"
              >
              {/* Icon */}
              <div className="text-4xl mb-6">{item.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Arrow Icon */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Professional Footer */}
        <footer className="mt-24 pt-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
              {/* Brand Column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">ChainVault</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                  The premier decentralized marketplace for blockchain-verified datasets. Trade verified data trustlessly on Ethereum L2.
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center transition-all duration-200 group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center transition-all duration-200 group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center transition-all duration-200 group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center transition-all duration-200 group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Products</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Datasets</a></li>
                  <li><a href="/create" className="text-gray-400 hover:text-white transition-colors">Create Dataset</a></li>
                  <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Trading API</a></li>
                </ul>
              </div>

              {/* Developers */}
              <div>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Developers</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">SDK</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Contracts</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
                  <p>© 2025 ChainVault. Developed by <span className="text-purple-400 font-semibold">ClassConnect Teams</span>.</p>
                  <span className="hidden md:block text-gray-700">|</span>
                  <p className="text-xs">All rights reserved.</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
                  <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
