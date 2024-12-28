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
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["res.cloudinary.com", "media.tenor.com"], 
//   },
// };

// export default nextConfig;