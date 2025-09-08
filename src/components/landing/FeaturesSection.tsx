// src/components/landing/FeaturesSection.tsx

import { ShieldCheck, DatabaseZap, Globe } from 'lucide-react';

const features = [
  {
    name: 'Secure Storage',
    description: 'All datasets are stored on IPFS, ensuring data is permanent, verifiable, and tamper-proof.',
    icon: ShieldCheck,
  },
  {
    name: 'On-Chain Proof',
    description: 'Each dataset is registered on the blockchain, providing an immutable record of ownership and authenticity.',
    icon: DatabaseZap,
  },
  {
    name: 'Open Marketplace',
    description: 'Discover and utilize valuable datasets from a global community in a transparent, decentralized environment.',
    icon: Globe,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:py-28">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need for trusted data exchange</h2>
          <p className="mt-6 text-lg text-gray-400">
            Our platform provides the tools to securely share and verify data with confidence.
          </p>
        </div>
        <div className="mt-16 max-w-lg mx-auto grid gap-12 lg:grid-cols-3 lg:max-w-none">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}