import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.development.local' });

const SqliteTestDataSourceOption: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
  dropSchema: true
};

const PostgresDataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  dropSchema:true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: [],
  ssl: false,
};

export const postgresDataSourceConfig = registerAs(
  'postgres',
  () => PostgresDataSourceOption,
);

export const sqliteDataSourceConfig = registerAs(
  'sqlite',
  () => SqliteTestDataSourceOption,
);

const createDataSource = (): DataSource => {
  const dbType = process.env.DB_TYPE;
  if (dbType === 'postgres') {
    return new DataSource(PostgresDataSourceOption);
  } else if (dbType === 'sqlite') {
    return new DataSource(SqliteTestDataSourceOption);
  } else {
    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
  }
};

export const DataSourceInstance = createDataSource();