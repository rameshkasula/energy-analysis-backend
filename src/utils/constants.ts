// ENV VARIABLES
import dotenv from 'dotenv';

dotenv.config();

export const ENV_VARIABLES = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URL: process.env.REDIS_URL,
    REDIS: {
        USERNAME: process.env.REDIS_USERNAME || 'default',
        PASSWORD: process.env.REDIS_PASSWORD,
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 15427
    }
}

// API ROUTES
export const API_ROUTES = {
    BASE_URL: '/api',
}
