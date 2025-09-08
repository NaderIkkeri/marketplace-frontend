export default function HeroSection() {
  return (
    <section className="flex items-center justify-center text-center py-24 px-4 sm:py-32 lg:py-40">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          A Decentralized Marketplace for Verifiable Data
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Leverage the power of blockchain and IPFS to create, share, and utilize datasets with unparalleled trust and transparency.
        </p>
        <div className="mt-10">
          <button
            className="rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}