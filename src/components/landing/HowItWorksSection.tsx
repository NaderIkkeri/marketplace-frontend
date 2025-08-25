// src/components/landing/HowItWorksSection.tsx

const steps = [
  {
    name: '1. Connect Your Wallet',
    description: 'Quickly and securely connect your favorite crypto wallet to interact with the marketplace.',
  },
  {
    name: '2. Upload & Verify Data',
    description: 'Upload your dataset file to IPFS to get a unique Content ID (CID) for verification.',
  },
  {
    name: '3. Create Your Dataset',
    description: 'Register your dataset on the blockchain by submitting its details and unique CID.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gray-800 py-20 px-4 sm:py-28">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get started in just a few minutes</h2>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.name} className="flex flex-col items-center">
              <div className="text-3xl font-bold text-indigo-400">{step.name.split('.')[0]}.</div>
              <h3 className="mt-4 text-xl font-medium">{step.name.split('. ')[1]}</h3>
              <p className="mt-2 text-base text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}