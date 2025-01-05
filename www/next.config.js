/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      '*'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  experimental: {
    optimizeCss: true // enables CSS optimization
  },
  async headers () {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
