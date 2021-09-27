import { OperationEntity } from '@entities/operation/';
import { BadRequestError, NotFoundError } from '@domain-error/custom-error';

import { IOperationRepository } from '@domain-ports/repositories/ioperation-repository';
import { IAssetRepository } from '@domain-ports/repositories/iasset-repository';
import { IOperationFactory } from '@domain-ports/factories/ioperation-factory';

import { ISubmitOperationInput, ISubmitOperationUseCase } from './submit-operation-interfaces';

export class SubmitOperationUseCase implements ISubmitOperationUseCase {
  constructor(
    private operationRepository: IOperationRepository,
    private paperRepository: IAssetRepository,
    private operationFactory: IOperationFactory,
  ) {
  }

  public async submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity> {
    const {
      value, quantity, type, assetCode, createdAt,
    } = submitOperationInput;

    if (!(value && quantity && type && assetCode && createdAt)) {
      throw BadRequestError('A required attr was not found');
    }

    const asset = await this.paperRepository.findByCode(assetCode);
    if (!asset) throw NotFoundError('Asset not found');

    const operation = this.operationFactory.make(value, quantity, type, asset, createdAt);
    const submitedOperation = await this.operationRepository.save(operation);
    return submitedOperation;
  }
}

export default SubmitOperationUseCase;
