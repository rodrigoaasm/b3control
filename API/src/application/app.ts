import 'reflect-metadata';

import * as express from 'express';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';

import configMiddlewares from 'src/application/config/middlewares';
import routes from 'src/application/config/routes';

export interface IApp {
  api: express.Express,
  database: Connection
}

export const createApp = async (configDatabase: ConnectionOptions): Promise<IApp> => {
  const connection = await createConnection(configDatabase);
  const api = express();
  const dependencies = await import('src/application/config/dependencies');

  configMiddlewares(api);
  await routes(api, dependencies.default);

  api.listen(4000);

  return {
    api,
    database: connection,
  };
};

export default createApp;
