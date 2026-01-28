/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // Increase from default 1mb
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.s3.**.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'kidokool-sanket-dev.s3.us-west-2.amazonaws.com',
            },
            {
                protocol: "https",
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "api.dicebear.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "avatar.vercel.sh"
            },
            {
                protocol: "https",
                hostname: "*.fly.storage.tigris.dev"
            },
            {
                protocol: "https",
                hostname: "randomuser.me",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "flagcdn.com",
            },
            {
                protocol: "https",
                hostname: "github.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "ui-avatars.com",
            }
        ],
    },
};

module.exports = nextConfig;
