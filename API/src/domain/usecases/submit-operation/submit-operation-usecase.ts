import { OperationEntity } from '@entities/operation/';
import { BadRequestError, NotFoundError } from '@domain-error/custom-error';
import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { IUnitOfWorkFactory } from '@domain-ports/factories/unit-of-work-factory-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { PositionEntity } from '@entities/position';
import { ISubmitOperationInput, ISubmitOperationUseCase } from './submit-operation-interfaces';

export class SubmitOperationUseCase implements ISubmitOperationUseCase {
  constructor(
    private assetRepository: IAssetRepository,
    private userRepository: IUserRepository,
    private operationFactory: IOperationFactory,
    private positionFactory: IPositionFactory,
    private storageUnitOfWorkFactory: IUnitOfWorkFactory,
  ) {
  }

  public async submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity> {
    let submittedOperation;
    const databaseUoW = await this.storageUnitOfWorkFactory.make();

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

    let userAssetCrtPosition = await databaseUoW.getPositionRepository()
      .getUserCurrentPosition(user.id, asset.id);
    const quantityForPositions = type === 'sale' ? quantity * -1 : quantity;
    if (!userAssetCrtPosition) {
      userAssetCrtPosition = this.positionFactory.make<PositionEntity>({
        clazzName: 'UserPositionEntity',
        asset,
        user,
        quantity: quantityForPositions,
        date: new Date(),
        price: 0,
        averageBuyPrice: value / quantity,
        investmentValue: value,
      });
    } else {
      userAssetCrtPosition.quantity += quantityForPositions;

      if (type === 'buy') {
        userAssetCrtPosition.investmentValue += value;
        userAssetCrtPosition
          .averageBuyPrice = userAssetCrtPosition.investmentValue / userAssetCrtPosition.quantity;
      }
    }

    if (userAssetCrtPosition.quantity < 0 && type === 'sale') {
      throw BadRequestError('The quantity to sell is greater than the current position');
    }

    const operation = this.operationFactory.make(value, quantity, type, asset, user, createdAt);

    await databaseUoW.runTransaction(async () => {
      await databaseUoW.getPositionRepository()
        .saveUserCurrentPosition(userAssetCrtPosition);
      submittedOperation = await databaseUoW.getOperationRepository()
        .save(operation);
    });

    return submittedOperation;
  }
}

export default SubmitOperationUseCase;
