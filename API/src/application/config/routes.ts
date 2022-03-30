import * as express from 'express';

export default async (app: express.Express, internalDependencies: any) => {
  const {
    expressMiddlewareAdapter,
    authTokenInterceptor,
    expressRouterAdapter,
    operationController,
    dividendPaymentController,
    assetTimeseriesReportController,
    dividendPaymentTimeseriesController,
  } = internalDependencies;

  app.post(
    '/operation',
    await expressMiddlewareAdapter.middlewareAdapter(authTokenInterceptor.verify),
    await expressRouterAdapter.routerAdapter(operationController.submit),
  );

  app.post(
    '/dividendpayment',
    await expressMiddlewareAdapter.middlewareAdapter(authTokenInterceptor.verify),
    await expressRouterAdapter.routerAdapter(dividendPaymentController.submit),
  );

  app.get(
    '/report/assettimeseries/codes/:codes?/begin/:begin?/end/:end?',
    await expressMiddlewareAdapter.middlewareAdapter(authTokenInterceptor.verify),
    await expressRouterAdapter.routerAdapter(
      assetTimeseriesReportController.getStockTimeseries,
    ),
  );

  app.get(
    '/report/dividendpayments/codes/:codes?/begin/:begin?/end/:end?',
    await expressMiddlewareAdapter.middlewareAdapter(authTokenInterceptor.verify),
    await expressRouterAdapter.routerAdapter(
      dividendPaymentTimeseriesController.getDividendPaymentTimeseries,
    ),
  );
};
