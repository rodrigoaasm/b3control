import * as express from 'express';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';

export default async (app : express.Express, internalDependencies) => {
  app.post(
    '/operation/submit',
    await ExpressRouterAdapter.routerAdapter(internalDependencies.operationController.submit),
  );

  app.get(
    '/report/stocktimeline/codes/:codes?/begin/:begin?/end/:end?',
    await ExpressRouterAdapter.routerAdapter(
      internalDependencies.reportsController.getStockTimeLine,
    ),
  );
};