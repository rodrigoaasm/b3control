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
    signInController,
    assetsListingController,
    walletDistributionReportController,
  } = internalDependencies;

  app.post(
    '/signin',
    await expressRouterAdapter.routerAdapter(signInController.signIn),
  );

  app.get(
    '/assets',
    await expressRouterAdapter.routerAdapter(assetsListingController.getList),
  );

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

  app.get(
    '/report/walletstatus',
    await expressMiddlewareAdapter.middlewareAdapter(authTokenInterceptor.verify),
    await expressRouterAdapter.routerAdapter(
      walletDistributionReportController.getWalletDistribution,
    ),
  );
};
