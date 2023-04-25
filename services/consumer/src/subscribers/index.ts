import Redis from 'ioredis';
import configs from '../environments';
import log from '../libs/log';

export const subscribers = (redis: Redis) => {
  redis.subscribe(configs.redis.channel, (error: Error | null | undefined) => {
    if (error) {
      log.error(`Error: ${error}`);
    } else {
      redis.on(configs.redis.channel, (channel: string, message: string) => {
        log.info(`Received ${message} from ${channel}`);
      });
    }
  });
};
