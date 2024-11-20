import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Environment } from '../environment-config/environment-config.validation';

dotenvConfig({ path: join(__dirname, '..', '..', '..', '.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: +`${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [join(__dirname, '..', '..', '**', '*.entity{.ts,.js}')],
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: false,
  migrations: [join(__dirname, '..', '..', '/migrations/**/*{.ts,.js}')],
  logging: process.env.NODE_ENV === Environment.Development,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
