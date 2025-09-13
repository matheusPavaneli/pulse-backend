import type IRedisRootConfig from 'src/common/interfaces/IRedisRootConfig';

export default (): IRedisRootConfig => {
  return {
    redisConfig: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
    },
  };
};
