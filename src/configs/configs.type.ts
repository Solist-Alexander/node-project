export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  sentry: SentryConfig;
  jwt: JWTConfig;
  aws: AWSConfig;
  hashRounds: number;
};

export type AppConfig = {
  port: number;
  host: string;
};

export type DatabaseConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  password: string;
};

export type SentryConfig = {
  dsn: string;
  debug: boolean;
  env: string;
};

export type JWTConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};

export type AWSConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
};
