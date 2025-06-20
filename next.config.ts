import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1748952411426.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev',
      'https://6000-firebase-studio-1748952411426.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
