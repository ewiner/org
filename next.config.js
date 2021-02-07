module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/1/management',
                permanent: false,
            },
        ]
    },
}
