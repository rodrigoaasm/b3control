import { Connection } from 'typeorm';

import { OperationFactory } from '@entities/operation/operation-factory';
import { OperationRepository } from '@external/datasource/relational/repositories/operation-repository';
import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';
import { ReportsRepository } from '@external/datasource/relational/repositories/reports-repository';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { AssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-usecase';
import { OperationController } from 'src/application/controllers/operation-controller';
import { ReportsController } from '@controllers/reports-controller';
import { DateValidatorUtil } from '@utils/date-validator-util';
import { PositionFactory } from '@entities/position';

export class InternalDependenciesFactory {
  public static make(connection: Connection) {
    // Utils
    const dateValidatorUtil = new DateValidatorUtil();

    // Factories
    const operationFactory = new OperationFactory(dateValidatorUtil);
    const positionFactory = new PositionFactory(dateValidatorUtil);

    // Repositories
    const operationRepository = new OperationRepository(connection, operationFactory);
    const assetRepository = new AssetRepository(connection);
    const reportsRepository = new ReportsRepository(connection, positionFactory);

    // Use cases
    const submitOperationUseCase = new SubmitOperationUseCase(
      operationRepository, assetRepository, operationFactory,
    );
    const assetTimeSeriesReportUseCase = new AssetTimeSeriesReportUseCase(
      reportsRepository, dateValidatorUtil,
    );

    // Controllers
    const operationController = new OperationController(submitOperationUseCase);
    const reportsController = new ReportsController(
      assetTimeSeriesReportUseCase, dateValidatorUtil,
    );

    return {
      operationController,
      reportsController,
    };
  }
}

export default InternalDependenciesFactory;