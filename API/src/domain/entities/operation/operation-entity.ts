import { AssetEntity } from '@entities/asset/asset-entity';
import { OperationType } from './operation-type';

export interface OperationEntity {
  id ?: number;
  value : number;
  quantity : number;
  type : OperationType;
  asset : AssetEntity;
  createdAt : Date;
}
