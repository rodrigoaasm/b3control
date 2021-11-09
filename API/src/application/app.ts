import 'reflect-metadata';

import * as express from 'express';
import { Connection } from 'typeorm';

import configMiddlewares from 'src/application/config/middlewares';
import routes from 'src/application/config/routes';
import { InternalDependenciesFactory } from 'src/application/config/internal-dependencies-factory';

export interface IApp {
  api: express.Express,
}

export const createApp = async (connection: Connection): Promise<IApp> => {
  const api = express();

  const internalDependencies = InternalDependenciesFactory.make(connection);

  configMiddlewares(api);
  await routes(api, internalDependencies);

  return {
    api,
  };
};

export default createApp;
