import { OperationFactory } from '@entities/operation/operation-factory';
import { OperationRepository } from '@external/datasource/relational/repositories/operation-repository';
import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { OperationController } from 'src/application/controllers/operation-controller';
import { DateValidatorUtil } from '@utils/date-validator-util';

// Utils
const dateValidatorUtil = new DateValidatorUtil();

// Factories
const operationFactory = new OperationFactory(dateValidatorUtil);

// Repositories
const operationRepository = new OperationRepository(operationFactory);
const paperRepositoryMock = new AssetRepository();

// Use cases
const submitOperationUseCase = new SubmitOperationUseCase(
  operationRepository, paperRepositoryMock, operationFactory,
);

// Controllers
const operationController = new OperationController(submitOperationUseCase);

export default {
  operationController,
};
