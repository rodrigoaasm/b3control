import 'reflect-metadata';
import * as express from 'express';

import configMiddlewares from '@config/middlewares';
import routes from '@config/routes';

export const createApp = async (): Promise<express.Express> => {
  const app = express();
  configMiddlewares(app);
  await routes(app);

  return app;
};

export default createApp;
