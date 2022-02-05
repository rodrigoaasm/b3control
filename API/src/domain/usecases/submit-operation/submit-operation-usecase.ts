import { OperationEntity } from '@entities/operation/';
import { BadRequestError, NotFoundError } from '@domain-error/custom-error';

import { IOperationRepository } from '@domain-ports/repositories/operation-repository-interface';
import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';

import { ISubmitOperationInput, ISubmitOperationUseCase } from './submit-operation-interfaces';

export class SubmitOperationUseCase implements ISubmitOperationUseCase {
  constructor(
    private operationRepository: IOperationRepository,
    private assetRepository: IAssetRepository,
    private userRepository: IUserRepository,
    private operationFactory: IOperationFactory,
  ) {
  }

  public async submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity> {
    const {
      value, userId, quantity, type, assetCode, createdAt,
    } = submitOperationInput;

    if (!(value && quantity && type && assetCode && createdAt)) {
      throw BadRequestError('A required attr was not found');
    }

    const user = await this.userRepository.findUser(userId);
    if (!user) throw NotFoundError('User not found');

    const asset = await this.assetRepository.findByCode(assetCode);
    if (!asset) throw NotFoundError('Asset not found');

    const operation = this.operationFactory.make(value, quantity, type, asset, user, createdAt);
    const submitedOperation = await this.operationRepository.save(operation);
    return submitedOperation;
  }
}

export default SubmitOperationUseCase;
