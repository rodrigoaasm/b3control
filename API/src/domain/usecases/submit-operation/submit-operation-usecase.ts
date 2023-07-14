import { OperationEntity } from '@entities/operation/';
import { BadRequestError, NotFoundError } from '@domain-error/custom-error';
import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { IUnitOfWorkFactory } from '@domain-ports/factories/unit-of-work-factory-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { UserPositionEntity } from '@entities/position';
import { IUnitOfWork } from '@domain-ports/unit-work-interface';
import { UserEntity } from '@entities/user';
import { AssetEntity } from '@entities/asset';
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

  private static _validateSubmit(submitOperationInput: ISubmitOperationInput): void {
    const {
      value, quantity, type, assetCode, createdAt,
    } = submitOperationInput;

    if (!(value && quantity && type && assetCode && createdAt)) {
      throw BadRequestError('A required attr was not found');
    }

    if (Number.isNaN(Number(quantity)) || Number(quantity) <= 0) {
      throw BadRequestError('Quantity is invalid');
    }
  }

  private async _handlePosition(
    databaseUoW:IUnitOfWork,
    value: number,
    quantity: number,
    type: string,
    user: UserEntity,
    asset: AssetEntity,
  ): Promise<UserPositionEntity> {
    let uAssetCrtPosition = await databaseUoW.getPositionRepository()
      .getUserCurrentPosition(user.id, asset.id);

    const quantityForPositions = type === 'sale' ? quantity * -1 : quantity;

    if (!uAssetCrtPosition) {
      uAssetCrtPosition = this.positionFactory.make<UserPositionEntity>({
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
      uAssetCrtPosition.quantity += quantityForPositions;

      if (type === 'buy') {
        uAssetCrtPosition.investmentValue += value;
        uAssetCrtPosition
          .averageBuyPrice = uAssetCrtPosition.investmentValue / uAssetCrtPosition.quantity;
      } else {
        uAssetCrtPosition.investmentValue
        += uAssetCrtPosition.averageBuyPrice * quantityForPositions;
      }
    }

    if (uAssetCrtPosition.quantity < 0 && type === 'sale') {
      throw BadRequestError('The quantity to sell is greater than the current position');
    }

    return uAssetCrtPosition;
  }

  public async submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity> {
    SubmitOperationUseCase._validateSubmit(submitOperationInput);

    const {
      value, userId, quantity, type, assetCode, createdAt,
    } = submitOperationInput;
    const databaseUoW = this.storageUnitOfWorkFactory.make();

    const user = await this.userRepository.findUser(userId);
    if (!user) throw NotFoundError('User not found');

    const asset = await this.assetRepository.findByCode(assetCode);
    if (!asset) throw NotFoundError('Asset not found');

    const uAssetCrtPosition = await this._handlePosition(
      databaseUoW, value, quantity, type, user, asset,
    );

    const operation = this.operationFactory.make(value, quantity, type, asset, user, createdAt);
    let submittedOperation: OperationEntity;
    await databaseUoW.runTransaction(async () => {
      await databaseUoW.getPositionRepository().saveUserCurrentPosition(uAssetCrtPosition);
      submittedOperation = await databaseUoW.getOperationRepository()
        .save(operation);
    });

    return submittedOperation;
  }
}

export default SubmitOperationUseCase;
