module.exports = {
  async redirects() {
    return [
      // // Removed for security reasons - you have to know a sheet ID or at least the old URL format.
      // {
      //     source: '/',
      //     destination: '/1/management',
      //     permanent: false,
      // },
      {
        source: '/:workbook',
        destination: `/:workbook/1/management`,
        permanent: false,
      },
      {
        source: '/:sheetId/management',
        destination: `/${process.env.DATA_GSHEET}/:sheetId/management`,
        permanent: false,
      },
      {
        source: '/:sheetId/program',
        destination: `/${process.env.DATA_GSHEET}/:sheetId/program`,
        permanent: false,
      },
    ]
  },
}
