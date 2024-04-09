const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}.env.local`}) // Include varaibles from .env.local
dotenv.config({ path: `${__dirname}.env.production`, override: true }) // Include varaibles from .env.development
dotenv.config({ path: `${__dirname}.env.development`, override: true }) // Include varaibles from .env.local

const nextConfig = {
    env: {
        BACKEND: process.env.BACKEND,
        SURVEY_JWT_KEY: process.env.SURVEY_JWT_SECRET,
    },
    distDir: 'build',
    staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;