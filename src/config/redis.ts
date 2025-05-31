import { createClient } from 'redis';
import { ENV_VARIABLES } from '../utils/constants';

export const redisClient = createClient({
    username: ENV_VARIABLES.REDIS.USERNAME,
    password: ENV_VARIABLES.REDIS.PASSWORD,
    socket: {
        host: ENV_VARIABLES.REDIS.HOST,
        port: ENV_VARIABLES.REDIS.PORT
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

// Example usage function
export const testRedisConnection = async () => {
    try {
        await redisClient.connect();
        await redisClient.set('test', 'Redis connection successful');
        const result = await redisClient.get('test');
        console.log('Redis test result:', result);
        return true;
    } catch (error) {
        console.error('Redis connection test failed:', error);
        return false;
    }
};
