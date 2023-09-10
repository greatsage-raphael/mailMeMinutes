/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@nylas/nylas-react$'] = '@nylas/nylas-react/lib/index.js';
    }

    config.module.rules.push({
      test: /@nylas\/nylas-react/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [],
        },
      },
    });

    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ["upcdn.io", "replicate.delivery", "lh3.googleusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/Nutlope/restorePhotos",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js/ai-photo-restorer",
        permanent: false,
      },
    ];
  },
};
