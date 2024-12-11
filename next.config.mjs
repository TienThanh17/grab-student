/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'online.hcmue.edu.vn',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
