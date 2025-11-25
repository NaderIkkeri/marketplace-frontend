export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.9" />

      {/* Data bars - representing a database/chart */}
      <rect x="25" y="45" width="8" height="30" rx="2" fill="white" opacity="0.9" />
      <rect x="38" y="35" width="8" height="40" rx="2" fill="white" opacity="0.9" />
      <rect x="51" y="40" width="8" height="35" rx="2" fill="white" opacity="0.9" />
      <rect x="64" y="30" width="8" height="45" rx="2" fill="white" opacity="0.9" />

      {/* Connecting dots - blockchain theme */}
      <circle cx="29" cy="43" r="3" fill="white" />
      <circle cx="42" cy="33" r="3" fill="white" />
      <circle cx="55" cy="38" r="3" fill="white" />
      <circle cx="68" cy="28" r="3" fill="white" />

      {/* Connection lines */}
      <line x1="29" y1="43" x2="42" y2="33" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="42" y1="33" x2="55" y2="38" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="55" y1="38" x2="68" y2="28" stroke="white" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
