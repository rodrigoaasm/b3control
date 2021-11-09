import { ConnectionOptions } from 'typeorm';
import entities from '@external/datasource/relational/models';

const connectionOptions : ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities,
};

export default connectionOptions;
