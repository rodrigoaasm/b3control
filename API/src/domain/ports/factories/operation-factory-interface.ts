import { OperationEntity, OperationType } from '@entities/operation';
import { AssetEntity } from '@entities/asset';
import { UserEntity } from '@entities/user';

export interface IOperationFactory {
  make(value : number, quantity : number, type : OperationType,
    asset : AssetEntity, user: UserEntity, createdAt: Date | string, id ?: number | undefined)
  : OperationEntity;
}
