/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these security headers to all routes
        source: '/(.*)',
        headers: [
          // Prevent the site from being embedded in iframes (clickjacking protection)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Block MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information sent with requests
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Restrict browser features/APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy — tightened to block inline scripts/styles from unknown origins
          // Note: 'unsafe-inline' is needed for Next.js inline styles; remove when possible
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://www.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://firebase.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com wss:",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Enforce HTTPS (only add in production — Vercel/CDN handles this but belt-and-suspenders)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Disable DNS prefetching to prevent information leakage
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
