const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}.env.local`}) // include varaibles from .env.local
dotenv.config({ path: `${__dirname}.env.development`, override: true }) // include varaibles from .env.local

const nextConfig = {
    env: {
        SURVEY_JWT_KEY:   process.env.SURVEY_JWT_SECRET,
        AES_SALT:         process.env.AES_SALT,
        AES_ITERATIONS:   process.env.AES_ITERATIONS,
        AES_LEN_KEY:      process.env.AES_LEN_KEY,
        AES_LEN_INIT_VEC: process.env.AES_LEN_INIT_VEC,
    },
};

module.exports = nextConfig;