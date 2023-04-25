export const REDIS_CHANNEL = process.env.REDIS_CHANNEL || 'redis-channel';

export default { redis: { channel: REDIS_CHANNEL } };
