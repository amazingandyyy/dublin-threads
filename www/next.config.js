/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve remote images as-is instead of routing them through /_next/image.
    // These are hundreds of photos on slow third-party planning-portal hosts;
    // optimizing them meant the server refetched and re-encoded every one,
    // which made the thread list crawl. Unoptimized trades image transforms
    // for not having a proxy in the hot path.
    unoptimized: true,
    // Remote images come from arbitrary city and planning-portal hosts, many
    // of them still plain http, so allow any host on either protocol instead
    // of maintaining an allowlist. Note `domains` is exact-match only and does
    // not accept wildcards -- the previous ['*'] entry matched nothing, and
    // the https-only pattern is what rejected http:// sources.
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**'
      },
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
