/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ticket-system/shared'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs: false,
        path: false,
        os: false,
        stream: false,
        util: false,
        buffer: false,
        events: false,
        assert: false,
        constants: false,
        domain: false,
        punycode: false,
        querystring: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        url: false,
        vm: false,
        zlib: false,
      };
    }
    
    // Ignore problematic modules
    config.module.rules.push({
      test: /node_modules\/@mapbox\/node-pre-gyp/,
      use: 'ignore-loader'
    });
    
    config.module.rules.push({
      test: /node_modules\/argon2/,
      use: 'ignore-loader'
    });
    
    return config;
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production'
  },
  async rewrites() {
    return [
      {
        source: '/transcripts/:guildId/:filename',
        destination: '/api/transcripts/:guildId/:filename'
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;