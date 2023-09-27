/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/dashboard/profiles',
                destination: '/',
                permanent: true,
            },
            {
                source: '/pl/dashboard/profiles',
                destination: '/',
                permanent: true,
            },
            {
                source: '/en/dashboard/profiles',
                destination: '/',
                permanent: true,
            },
            {
                source: '/beta/:path*',
                destination: '/dashboard/:path*',
                permanent: false
            },
            {
                source: '/pl/beta/:path*',
                destination: '/dashboard/:path*',
                permanent: false
            },
            {
                source: '/en/beta/:path*',
                destination: '/dashboard/:path*',
                permanent: false
            }
        ]
    },
};

module.exports = nextConfig;