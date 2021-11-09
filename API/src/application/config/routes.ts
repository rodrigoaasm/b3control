import * as express from 'express';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';

export default async (app : express.Express, internalDependencies) => {
  app.post(
    '/operation/submit',
    await ExpressRouterAdapter.routerAdapter(internalDependencies.operationController.submit),
  );
};
