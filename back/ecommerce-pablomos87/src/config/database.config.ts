import { config as dotenvConfig} from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.development'})

const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port:process.env.DB_PORT as unknown as number, 
  username:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}']
};

export default registerAs('databaseConfig', () => databaseConfig);

export const connectionSource = new DataSource (databaseConfig as DataSourceOptions);