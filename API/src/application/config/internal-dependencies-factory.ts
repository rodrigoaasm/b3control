import { Connection } from 'typeorm';

import { OperationFactory } from '@entities/operation/operation-factory';
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
import { SignInUsecase } from '@usecases/auth/sign-in-usecase';
import { SignInController } from '@controllers/sign-in-controller';
import { DateHandlerUtil } from '@utils/date-handler-util';
import { ExpressHTTPErrorAdapter } from '@external/adapters/express-http-error-adapter';
import { UserRepository } from '@external/datasource/relational/repositories/user-repository';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';
import { AuthTokenInterceptor } from '@interceptors/auth-token-interceptor';
import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';
import { ExpressMiddlewareAdapter } from '@external/adapters/express-middleware-adapter';
import { CryptAdapter } from '@external/adapters/bcrypt-adapter';
import { WalletDistributionReportController } from '@controllers/wallet-distribution-report-controller';
import { WalletDistributionReportUseCase } from '@usecases/reports/wallet-distribution-report/wallet-distribution-report-usecase';
import { AssetsListingController } from '@controllers/assets-listing-controller';
import { AssetsListingUsecase } from '@usecases/assets-listing/assets-listing-usecase';
import { RelationalUnitOfWorkFactory } from '@external/datasource/relational/relational-unit-of-work-factory';

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
    const cryptAdapter = new CryptAdapter();

    // Factories
    const operationFactory = new OperationFactory(dateHandlerUtil);
    const positionFactory = new PositionFactory(dateHandlerUtil);
    const dividendPaymentFactory = new DividendPaymentFactory(dateHandlerUtil);
    const relationalUnitOfWorkFactory = new RelationalUnitOfWorkFactory(
      connection, operationFactory, positionFactory,
    );

    // Repositories
    const assetRepository = new AssetRepository(connection);
    const positionRepository = new PositionRepository(connection, positionFactory);
    const userRepository = new UserRepository(connection);
    const dividendPaymentRepository = new DividendPaymentRepository(
      connection, dividendPaymentFactory,
    );

    // Use cases
    const submitOperationUseCase = new SubmitOperationUseCase(
      assetRepository,
      userRepository,
      operationFactory,
      positionFactory,
      relationalUnitOfWorkFactory,
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
    const signInUseCase = new SignInUsecase(userRepository, jwtHandlerAdapter, cryptAdapter);
    const walletDistributionReportUseCase = new WalletDistributionReportUseCase(positionRepository);
    const assetsListingUsecase = new AssetsListingUsecase(assetRepository);

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
    const signInController = new SignInController(signInUseCase);
    const walletDistributionReportController = new WalletDistributionReportController(
      walletDistributionReportUseCase,
    );
    const assetsListingController = new AssetsListingController(assetsListingUsecase);

    return {
      expressMiddlewareAdapter,
      expressRouterAdapter,
      authTokenInterceptor,
      signInController,
      assetsListingController,
      operationController,
      assetTimeseriesReportController,
      dividendPaymentController,
      dividendPaymentTimeseriesController,
      walletDistributionReportController,
    };
  }
}

export default InternalDependenciesFactory;
