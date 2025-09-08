// src/components/landing/CTASection.tsx

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:py-28">
      <div className="container mx-auto text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to dive in?
        </h2>
        <p className="mt-6 text-lg text-gray-400">
          Join the decentralized data economy today. Connect your wallet and create your first dataset in minutes.
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