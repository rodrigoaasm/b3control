import { OperationEntity, OperationType } from '@entities/operation';
import { AssetEntity } from '@entities/asset';

export interface IOperationFactory {
  make(value : number, quantity : number, type : OperationType,
    asset : AssetEntity, createdAt: Date | string, id ?: number | undefined)
  : OperationEntity;
}
