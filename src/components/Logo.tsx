import Image from 'next/image';

export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src="/QuantifyX.png"
        alt="QuantifyX Logo"
        width={200}
        height={200}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
