/** @type {import('next').NextConfig} */
const nextConfig = {
  // This part creates a custom security policy for development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This value allows 'unsafe-eval' ONLY when you run 'npm run dev'
            value:
              process.env.NODE_ENV === 'development'
                ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' * data:;"
                : "default-src 'self' 'unsafe-inline' * data:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;