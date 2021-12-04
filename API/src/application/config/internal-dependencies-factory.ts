import { Connection } from 'typeorm';

import { OperationFactory } from '@entities/operation/operation-factory';
import { OperationRepository } from '@external/datasource/relational/repositories/operation-repository';
import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';
import { PositionRepository } from '@external/datasource/relational/repositories/position-repository';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { AssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-usecase';
import { OperationController } from 'src/application/controllers/operation-controller';
import { AssetTimeseriesReportController } from '@controllers/asset-timeseries-report-controller';
import { DateValidatorUtil } from '@utils/date-validator-util';
import { PositionFactory } from '@entities/position';
import { DividendPaymentFactory } from '@entities/dividend-payment';
import { DividendPaymentRepository } from '@external/datasource/relational/repositories/dividend-payment-repository';
import { SubmitDividendPaymentUseCase } from '@usecases/submit-dividend/submit-dividend-payments-usecase';
import { DividendPaymentController } from '@controllers/dividend-payment-controller';
import { ReportInputHandler } from '@utils/report-input-handler';

export class InternalDependenciesFactory {
  public static make(connection: Connection) {
    // Utils
    const dateValidatorUtil = new DateValidatorUtil();
    const reportInputHandler = new ReportInputHandler(dateValidatorUtil);

    // Factories
    const operationFactory = new OperationFactory(dateValidatorUtil);
    const positionFactory = new PositionFactory(dateValidatorUtil);
    const dividendPaymentFactory = new DividendPaymentFactory(dateValidatorUtil);

    // Repositories
    const operationRepository = new OperationRepository(connection, operationFactory);
    const assetRepository = new AssetRepository(connection);
    const positionRepository = new PositionRepository(connection, positionFactory);
    const dividendPaymentRepository = new DividendPaymentRepository(
      connection, dividendPaymentFactory,
    );

    // Use cases
    const submitOperationUseCase = new SubmitOperationUseCase(
      operationRepository, assetRepository, operationFactory,
    );
    const assetTimeSeriesReportUseCase = new AssetTimeSeriesReportUseCase(
      positionRepository, dateValidatorUtil,
    );
    const submitDividendPaymentUseCase = new SubmitDividendPaymentUseCase(
      dividendPaymentRepository, assetRepository, dividendPaymentFactory,
    );

    // Controllers
    const operationController = new OperationController(submitOperationUseCase);
    const assetTimeseriesReportController = new AssetTimeseriesReportController(
      assetTimeSeriesReportUseCase, reportInputHandler,
    );
    const dividendPaymentController = new DividendPaymentController(submitDividendPaymentUseCase);

    return {
      operationController,
      assetTimeseriesReportController,
      dividendPaymentController,
    };
  }
}

export default InternalDependenciesFactory;
