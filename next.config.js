module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/1/management',
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
