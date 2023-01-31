import { OperationEntity } from '@entities/operation/';
import { BadRequestError, NotFoundError } from '@domain-error/custom-error';

import { IOperationRepository } from '@domain-ports/repositories/operation-repository-interface';
import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';

import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';

import { IUnitOfWorkFactory } from '@domain-ports/factories/unit-of-work-factory-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { ISubmitOperationInput, ISubmitOperationUseCase } from './submit-operation-interfaces';

export class SubmitOperationUseCase implements ISubmitOperationUseCase {
  constructor(
    private operationRepository: IOperationRepository,
    private assetRepository: IAssetRepository,
    private userRepository: IUserRepository,
    private positionRepository: IPositionRepository,
    private operationFactory: IOperationFactory,
    private positionFactory: IPositionFactory,
    private unitOfWorkFactory: IUnitOfWorkFactory,
  ) {
  }

  public async submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity> {
    let submittedOperation;

    const {
      value, userId, quantity, type, assetCode, createdAt,
    } = submitOperationInput;

    // Validation inputs
    if (!(value && quantity && type && assetCode && createdAt)) {
      throw BadRequestError('A required attr was not found');
    }

    if (Number.isNaN(Number(quantity)) || Number(quantity) <= 0) {
      throw BadRequestError('Quantity is invalid');
    }

    const user = await this.userRepository.findUser(userId);
    if (!user) throw NotFoundError('User not found');

    const asset = await this.assetRepository.findByCode(assetCode);
    if (!asset) throw NotFoundError('Asset not found');

    let userAssetCurrentPosition = await this.positionRepository
      .getUserCurrentPosition(user.id, asset.id);
    const quantityForPositions = type === 'sale' ? quantity * -1 : quantity;
    if (!userAssetCurrentPosition) {
      userAssetCurrentPosition = this.positionFactory.make(
        asset, user, quantityForPositions, 0, new Date(),
      );
    } else {
      userAssetCurrentPosition.quantity += quantityForPositions;
    }

    if (userAssetCurrentPosition.quantity < 0 && type === 'sale') {
      throw BadRequestError('The quantity to sell is greater than the current position');
    }

    const operation = this.operationFactory.make(value, quantity, type, asset, user, createdAt);
    const unitOfWork = this.unitOfWorkFactory.make();
    await unitOfWork.start();
    await unitOfWork.complete(async () => {
      await this.positionRepository
        .saveUserCurrentPosition(userAssetCurrentPosition);
      submittedOperation = await this.operationRepository.save(operation);
    });

    return submittedOperation;
  }
}

export default SubmitOperationUseCase;
