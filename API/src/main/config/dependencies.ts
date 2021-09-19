import { OperationFactory } from '@entities/operation/operation-factory';
import OperationRepositoryMock from '@mocks/operation-repository-mock';
import AssetRepositoryMock from '@mocks/asset-repository-mock';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { OperationController } from '@controllers/operation-controller';
import { DateValidatorUtil } from '@utils/date-validator-util';

// Utils
const dateValidatorUtil = new DateValidatorUtil();

// Factories
const operationFactory = new OperationFactory(dateValidatorUtil);

// Repositories
const operationRepository = new OperationRepositoryMock();
const paperRepositoryMock = new AssetRepositoryMock();

// Use cases
const submitOperationUseCase = new SubmitOperationUseCase(
  operationRepository, paperRepositoryMock, operationFactory,
);

// Controllers
const operationController = new OperationController(submitOperationUseCase);

export default {
  operationController,
};
