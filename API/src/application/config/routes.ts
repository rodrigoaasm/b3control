import * as express from 'express';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';

export default async (app: express.Express, internalDependencies: any) => {
  const expressRouterAdapter = new ExpressRouterAdapter(
    internalDependencies.expressHttpErrorAdapter,
  );

  app.post(
    '/operation',
    await expressRouterAdapter.routerAdapter(internalDependencies.operationController.submit),
  );

  app.post(
    '/dividendpayment',
    await expressRouterAdapter.routerAdapter(internalDependencies.dividendPaymentController.submit),
  );

  app.get(
    '/report/assettimeseries/codes/:codes?/begin/:begin?/end/:end?',
    await expressRouterAdapter.routerAdapter(
      internalDependencies.assetTimeseriesReportController.getStockTimeseries,
    ),
  );

  app.get(
    '/report/dividendpayments/codes/:codes?/begin/:begin?/end/:end?',
    await expressRouterAdapter.routerAdapter(
      internalDependencies.dividendPaymentTimeseriesController.getDividendPaymentTimeseries,
    ),
  );
};
