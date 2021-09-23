import { OperationEntity } from '@entities/operation/';

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
    const asset = await this.paperRepository.findByCode(assetCode);
    if (!asset) throw new Error('Asset not found');

    const operation = this.operationFactory.make(value, quantity, type, asset, createdAt);
    const submitedOperation = await this.operationRepository.save(operation);
    return submitedOperation;
  }
}

export default SubmitOperationUseCase;
