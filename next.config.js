module.exports = {
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
