/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/:workbook',
        destination: `/:workbook/1/management`,
        permanent: false,
      }
    ]
  },
}

module.exports = nextConfig
