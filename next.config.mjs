/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'firebasestorage.googleapis.com',
              pathname: '/*/**',
          },
          {
              protocol: 'https',
              hostname: '**',
          },
      ],
  },
};

export default nextConfig;
