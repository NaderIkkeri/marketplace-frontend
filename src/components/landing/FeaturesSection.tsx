"use client";

import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const features = [
  {
    title: 'DataX',
    subtitle: 'Smarter trading, zero friction.',
    description: 'Gasless transactions and MEV protection, with zero fees for failed trades.',
    badge: 'MEV protection',
    gradient: 'gradient-pink-purple',
    glowClass: 'glow-text-purple',
    buttons: [
      { text: 'Experience DataX', icon: true },
      { text: 'Best swap', variant: 'secondary' },
      { text: 'Free', variant: 'secondary' }
    ]
  },
  {
    title: 'Data Provision',
    subtitle: 'Power onchain markets.',
    description: 'Provide datasets and collect fees using the ChainVault Interface.',
    gradient: 'gradient-green-teal',
    glowClass: 'glow-text-green',
    buttons: [
      { text: 'Explore datasets', icon: true }
    ]
  },
  {
    title: 'Trading API',
    subtitle: 'DeFi, direct to your users.',
    description: 'Use the same API that powers the ChainVault Web App and Wallet, trusted by leading protocols.',
    gradient: 'gradient-orange-brown',
    glowClass: 'glow-text-orange',
    buttons: [
      { text: 'chainvault-sdk', variant: 'code' }
    ]
  },
  {
    title: 'ChainData',
    subtitle: 'The DeFi chain.',
    description: 'Join the community building on the fast, decentralized Ethereum L2 built to be the home for verifiable data.',
    gradient: 'gradient-purple-grid',
    glowClass: 'glow-text-pink',
    buttons: []
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-12 px-4 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              direction="up"
              delay={index * 100}
              className={index === features.length - 1 ? 'lg:col-span-2' : ''}
            >
              <div
                className={`${feature.gradient} rounded-3xl p-8 sm:p-12 card-hover relative overflow-hidden h-full`}
              >
              {/* Icon/Badge */}
              {feature.badge && (
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300">🛡️</span>
                  </div>
                  <span className="text-purple-300 font-medium">{feature.badge}</span>
                </div>
              )}

              {/* Title */}
              <div className="mb-4">
                {feature.title === 'Data Provision' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-300">📊</span>
                    </div>
                    <span className="text-green-300 font-medium">{feature.title}</span>
                  </div>
                )}
                {feature.title === 'Trading API' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <span className="text-orange-300">🔧</span>
                    </div>
                    <span className="text-orange-300 font-medium">{feature.title}</span>
                  </div>
                )}
                {feature.title === 'ChainData' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <span className="text-pink-300">⛓️</span>
                    </div>
                    <span className="text-pink-300 font-medium">{feature.title}</span>
                  </div>
                )}
              </div>

              {/* Subtitle */}
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                {feature.subtitle}
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                {feature.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                {feature.buttons.map((button, btnIndex) => (
                  <button
                    key={btnIndex}
                    className={`
                      ${button.variant === 'secondary'
                        ? 'bg-white/10 hover:bg-white/15 px-5 py-2.5'
                        : button.variant === 'code'
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 px-6 py-3 font-mono text-orange-200'
                        : 'bg-white/5 hover:bg-white/10 px-6 py-3'
                      }
                      rounded-full text-white font-medium transition-all duration-200
                      border border-white/10 hover:border-white/20
                      flex items-center gap-2
                    `}
                  >
                    {button.text}
                    {button.icon && <ArrowRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* Decorative circles for ChainData */}
              {feature.title === 'ChainData' && (
                <div className="absolute right-8 bottom-8 flex items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-xl"></div>
                </div>
              )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}