
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
      {
        protocol: 'https',
        hostname: 'www.aljazeera.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'app.powerbi.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  transpilePackages: ['recharts', 'd3-shape'],
};

export default nextConfig;
