import { Connection } from 'typeorm';

import { OperationFactory } from '@entities/operation/operation-factory';
import { OperationRepository } from '@external/datasource/relational/repositories/operation-repository';
import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';
import { PositionRepository } from '@external/datasource/relational/repositories/position-repository';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { AssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-usecase';
import { OperationController } from 'src/application/controllers/operation-controller';
import { AssetTimeseriesReportController } from '@controllers/asset-timeseries-report-controller';
import { PositionFactory } from '@entities/position';
import { DividendPaymentFactory } from '@entities/dividend-payment';
import { DividendPaymentRepository } from '@external/datasource/relational/repositories/dividend-payment-repository';
import { SubmitDividendPaymentUseCase } from '@usecases/submit-dividend/submit-dividend-payments-usecase';
import { DividendPaymentController } from '@controllers/dividend-payment-controller';
import { ReportInputHandler } from '@utils/report-input-handler';
import { DividendPaymentTimeSeriesReportUseCase } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-usecase';
import { DividendPaymentTimeseriesController } from '@controllers/dividend-payment-timeseries-report-controller';
import { DateHandlerUtil } from '@utils/date-handler-util';
import { ExpressHTTPErrorAdapter } from '@external/adapters/express-http-error-adapter';
import { UserRepository } from '@external/datasource/relational/repositories/user-repository';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';
import { AuthTokenInterceptor } from '@interceptors/auth-token-interceptor';
import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';
import { ExpressMiddlewareAdapter } from '@external/adapters/express-middleware-adapter';

export class InternalDependenciesFactory {
  public static make(connection: Connection) {
    // Utils
    const dateHandlerUtil = new DateHandlerUtil();
    const reportInputHandler = new ReportInputHandler(dateHandlerUtil);

    // Adapters
    const expressHttpErrorAdapter = new ExpressHTTPErrorAdapter();
    const expressRouterAdapter = new ExpressRouterAdapter(
      expressHttpErrorAdapter,
    );
    const expressMiddlewareAdapter = new ExpressMiddlewareAdapter(
      expressHttpErrorAdapter,
    );
    const jwtHandlerAdapter = new JWTHandlerAdapter();

    // Factories
    const operationFactory = new OperationFactory(dateHandlerUtil);
    const positionFactory = new PositionFactory(dateHandlerUtil);
    const dividendPaymentFactory = new DividendPaymentFactory(dateHandlerUtil);

    // Repositories
    const operationRepository = new OperationRepository(connection, operationFactory);
    const assetRepository = new AssetRepository(connection);
    const positionRepository = new PositionRepository(connection, positionFactory);
    const userRepository = new UserRepository(connection);
    const dividendPaymentRepository = new DividendPaymentRepository(
      connection, dividendPaymentFactory,
    );

    // Use cases
    const submitOperationUseCase = new SubmitOperationUseCase(
      operationRepository, assetRepository, userRepository, operationFactory,
    );
    const assetTimeSeriesReportUseCase = new AssetTimeSeriesReportUseCase(
      positionRepository, dateHandlerUtil,
    );
    const submitDividendPaymentUseCase = new SubmitDividendPaymentUseCase(
      dividendPaymentRepository, assetRepository, userRepository, dividendPaymentFactory,
    );
    const dividendPaymentTimeSeriesReportUseCase = new DividendPaymentTimeSeriesReportUseCase(
      dividendPaymentRepository, dateHandlerUtil,
    );

    // Interceptors
    const authTokenInterceptor = new AuthTokenInterceptor(jwtHandlerAdapter);

    // Controllers
    const operationController = new OperationController(submitOperationUseCase);
    const assetTimeseriesReportController = new AssetTimeseriesReportController(
      assetTimeSeriesReportUseCase, reportInputHandler,
    );
    const dividendPaymentController = new DividendPaymentController(submitDividendPaymentUseCase);
    const dividendPaymentTimeseriesController = new DividendPaymentTimeseriesController(
      dividendPaymentTimeSeriesReportUseCase,
    );

    return {
      expressMiddlewareAdapter,
      authTokenInterceptor,
      expressRouterAdapter,
      operationController,
      assetTimeseriesReportController,
      dividendPaymentController,
      dividendPaymentTimeseriesController,
    };
  }
}

export default InternalDependenciesFactory;
