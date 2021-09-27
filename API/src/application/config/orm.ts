import { ConnectionOptions } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import entities from '@external/datasource/relational/models';

dotenv.config();

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
