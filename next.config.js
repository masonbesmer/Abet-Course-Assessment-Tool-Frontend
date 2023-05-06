const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}.env.local`}) // Include varaibles from .env.local
dotenv.config({ path: `${__dirname}.env.development`, override: true }) // Include varaibles from .env.local

const nextConfig = {
    env: {
        SURVEY_JWT_KEY:   process.env.SURVEY_JWT_SECRET,
    },
};

module.exports = nextConfig;