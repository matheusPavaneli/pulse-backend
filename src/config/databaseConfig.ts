import type IDatabaseRootConfig from 'src/common/interfaces/IDatabaseRootConfig';

export default (): IDatabaseRootConfig => {
  return {
    databaseConfig: {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'pulse-db',
    },
  };
};
