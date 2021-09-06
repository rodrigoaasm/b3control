import { PaperEntity } from '@entities/paper/paper-entity';
import { OperationType } from './operation-type';

export interface OperationEntity {
  id ?: number;
  value : number;
  quatity : number;
  type : OperationType;
  stock : PaperEntity;
  createdAt : Date;
}
