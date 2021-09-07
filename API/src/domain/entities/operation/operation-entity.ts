import { PaperEntity } from '@entities/paper/paper-entity';
import { OperationType } from './operation-type';

export interface OperationEntity {
  id ?: number;
  value : number;
  quantity : number;
  type : OperationType;
  paper : PaperEntity;
  createdAt : Date;
}
